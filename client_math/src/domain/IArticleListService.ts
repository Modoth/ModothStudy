export interface IArticleListChangedListener {
    (): void
}

export default class IArticleListService {
    add(id: string) {
        throw new Error('Method not implemented.')
    }

    has(id: string): boolean {
        throw new Error('Method not implemented.')
    }

    remove(id: string) {
        throw new Error('Method not implemented.')
    }

    clear() {
        throw new Error('Method not implemented.')
    }

    all(): string[] {
        throw new Error('Method not implemented.')
    }

    addChangeListener(listener: IArticleListChangedListener): void {
        throw new Error('Method not implemented.')
    }

    removeChangeListener(listener: IArticleListChangedListener): void {
        throw new Error('Method not implemented.')
    }
}

export class ArticleListSingletonService implements IArticleListService {

    private all_: string[] = []
    private allDict_ = new Set<string>()
    private listeners_ = new Set<IArticleListChangedListener>()

    add(id: string): void {
        if (this.has(id)) {
            return
        }
        this.allDict_.add(id)
        this.all_.push(id)
        this.raiseChange_()
    }

    has(id: string): boolean {
        return this.allDict_.has(id)
    }

    remove(id: string): void {
        this.allDict_.delete(id)
        this.all_ = this.all_.filter(i => id !== i)
        this.raiseChange_()
    }

    clear(): void {
        this.allDict_ = new Set()
        this.all_ = []
        this.raiseChange_()
    }

    all(): string[] {
        return Array.from(this.all_)
    }

    addChangeListener(listener: IArticleListChangedListener): void {
        this.listeners_.add(listener)
    }
    removeChangeListener(listener: IArticleListChangedListener): void {
        this.listeners_.delete(listener)
    }

    raiseChange_() {
        for (const listener of Array.from(this.listeners_.values())) {
            listener()
        }
    }
}