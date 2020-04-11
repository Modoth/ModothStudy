import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import {
  CommentService,
  LoginUser,
  Configs,
  CommentItem,
  NodeItem,
} from "src/app/apis";
import { AppService } from "src/app/services/app.service";
import { NotifyService } from "src/app/services/notify.service";
import { tap, map } from "rxjs/operators";
import { throwError, Subscription } from "rxjs";

@Component({
  selector: "app-comments-viewer",
  templateUrl: "./comments-viewer.component.html",
  styleUrls: ["./comments-viewer.component.scss"],
})
export class CommentsViewerComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((item) => item.unsubscribe());
    }
    this.subscriptions = null;
  }

  @Input() node: NodeItem;

  public loginUser: LoginUser;

  public currentPage = 0;
  public totalPage = 0;
  public pageSize = 10;
  public newComment = "";

  public commentsList: CommentItem[][] = [];

  public ownComments = new Set<CommentItem>();

  public hasCommentPermission = false;

  @Output() exit = new EventEmitter();

  constructor(
    public commentService: CommentService,
    public appService: AppService,
    public notifyService: NotifyService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.appService.loginUsers.subscribe((user) => this.loadComments(user))
    );
  }

  loadMoreComments() {
    let sub = this.commentService
      .getBlogComments(
        this.node.id,
        (this.currentPage + 1) * this.pageSize,
        this.pageSize
      )
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          if (this.loginUser) {
            for (const c of apiRes.data.data) {
              if (c.userId === this.loginUser.id) {
                this.ownComments.add(c);
              }
            }
          }
        }),
        map((apiRes) => apiRes.data)
      )
      .subscribe(
        ({ data, total }) => {
          if (data.length > 0) {
            this.commentsList.push(data);
            this.currentPage++;
            this.totalPage = Math.ceil(total / this.pageSize);
          }
        },
        (error) => this.notifyService.toast(error)
      );
    this.subscriptions.push(sub);
  }

  loadComments(user: LoginUser) {
    this.loginUser = user;
    this.hasCommentPermission =
      user != null &&
      user.permissions != null &&
      user.permissions[Configs.PermissionDescriptionsEnum.COMMENT];
    this.currentPage = -1;
    this.loadMoreComments();
  }

  addComment() {
    const comment = this.newComment.trim();
    if (comment === "") {
      return;
    }
    let sub = this.commentService
      .addComment(this.node.id, comment)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
        })
      )
      .subscribe(
        (apiRes) => {
          const lastCommentsList = this.commentsList[
            this.commentsList.length - 1
          ];
          if (lastCommentsList && lastCommentsList.length < this.pageSize) {
            const c = {
              id: apiRes.data,
              userName: this.loginUser.nickName,
              userId: this.loginUser.id,
              userAvatar: this.loginUser.avatar,
              detail: comment,
            };
            lastCommentsList.push(c);
            this.ownComments.add(c);
          }
          this.notifyService.toast(Configs.UiLangsEnum.CommentSuccess);
          this.newComment = "";
        },
        (error) => this.notifyService.toast(error)
      );
    this.subscriptions.push(sub);
  }

  deleteComment(comment: CommentItem, comments: CommentItem[]) {
    let sub = this.commentService
      .deleteComment(comment.id)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
        })
      )
      .subscribe((apiRes) => {
        const idx = comments.indexOf(comment);
        comments.splice(idx, 1);
        comments = comments.slice();
        this.commentsList = this.commentsList.slice();
      });
    this.subscriptions.push(sub);
  }
}
