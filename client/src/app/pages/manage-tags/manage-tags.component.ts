import { Component, ViewChild, OnDestroy } from '@angular/core';
import { TagsService, TagItem, NodeItem, Configs } from 'src/app/apis';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import { isNullOrSpace } from "src/app/utils/util";
import { PopupComponent } from 'src/app/shared/popup/popup.component'
import { tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss']
})
export class ManageTagsComponent implements OnDestroy {
  @ViewChild('textPopup') public textPopup: PopupComponent

  constructor(public tagsApi: TagsService,
    public route: ActivatedRoute,
    public router: Router,
    public notifyService: NotifyService) { }

  public totalCount = 0
  public filter = '';

  public tags: TagItem[];

  public types = TagItem.TypeEnum;

  public editTagData: TagItem = {}
  public readonly okStr = Configs.UiLangsEnum.Modify.toString()

  public openChangeValuesDialog = async (tag: TagItem) => {
    this.editTagData = tag
    if (tag.type !== TagItem.TypeEnum.Enum) {
      return;
    }
    this.textPopup.show()
  }
  async saveText(data: { values }) {
    let values = data.values || ''
    values = values.trim();
    if (values === '') {
      values = null;
    }
    this.tagsApi.updateTagValues(this.editTagData.id, values).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
        this.editTagData.values = values
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
  }


  public search = async (data: { filter }) => {
    if (isNullOrSpace(data.filter) && isNullOrSpace(this.filter)) return
    this.router.navigateByUrl(`/manage/tags/${data.filter.trim() || " "}/0`);
  }
  public readonly tagTypes = [TagItem.TypeEnum.Bool, TagItem.TypeEnum.Number, TagItem.TypeEnum.Enum, TagItem.TypeEnum.String, TagItem.TypeEnum.Url, TagItem.TypeEnum.Private]
  public createTag(type, data: { name, values }) {
    if (type == null || this.tagTypes.indexOf(type) < 0) {
      return;
    }
    let name = data.name.trim();
    if (name == '') {
      this.notifyService.toast(Configs.ServiceMessagesEnum.InvalidTagName);
      return;
    }
    let values = null;
    if (type === TagItem.TypeEnum.Enum) {
      values = data.values.trim();
      if (values === '') {
        this.notifyService.toast(Configs.ServiceMessagesEnum.InvalidTagValues);
        return;
      }
    }
    this.tagsApi.addTag(name, type, values).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
        this.tags.unshift(apiRes.data);
        this.tags = this.tags.slice(0);
        data.name = ''
        data.values = ''
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
  }

  public deleteTag = (tag: TagItem) => {
    this.tagsApi.removeTag(tag.id).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
        const idx = this.tags.indexOf(tag);
        this.tags.splice(idx, 1);
        this.tags = this.tags.slice(0)
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
  }



  public reloadTags = ({ filter, pageId, pageSize }) => {
    this.tagsApi.allTags(this.filter, +pageId * pageSize, pageSize).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
        this.tags = apiRes.data.data
        this.totalCount = apiRes.data.total
        this.filter = filter.trim();
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
  }

  ngOnDestroy() {
    this.textPopup = null
  }

}
