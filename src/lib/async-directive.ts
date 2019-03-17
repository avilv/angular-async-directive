import { Directive, Input, ViewContainerRef, TemplateRef, Host } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { AsyncRequest, asAsyncRequest } from "@aviellv/async-request-rxjs-pipe";

interface IAwaitView {
    destroyView(): void;
}

interface IAwaitLoadingView extends IAwaitView {
    createView(): void;
}

interface IAwaitFailureView<TError> extends IAwaitView {
    createView(value: TError): void;
}

interface IAwaitSuccessView<TValue> extends IAwaitView {
    createView(value: TValue): void;
}


@Directive({ selector: '[awaitRequest]' })
export class AwaitRequestDirective<TValue, TError> {

    private activeView: IAwaitView | null = null;

    private awaitLoadingView: IAwaitLoadingView | null = null;
    private awaitSuccessView: IAwaitSuccessView<TValue> | null = null;
    private awaitFailureView: IAwaitFailureView<TError> | null = null;

    private _requestSubscription!: Subscription;
    private _request!: Observable<AsyncRequest<TValue, TError>>;


    private setActiveView(view: IAwaitView | null) {
        if (this.activeView !== view) {
            if (this.activeView !== null)
                this.activeView.destroyView();
            this.activeView = view;
        }
    }

    @Input()
    set awaitRequest(request: Observable<TValue>) {
        this.setRequest(request);
    }



    private onRequestState(requestState: AsyncRequest<TValue, TError>) {
        switch (requestState.state) {
            case "loading": {
                this.setActiveView(this.awaitLoadingView);
                if (this.awaitLoadingView !== null)
                    this.awaitLoadingView.createView();
                break;
            }
            case "success": {
                this.setActiveView(this.awaitSuccessView);
                if (this.awaitSuccessView !== null)
                    this.awaitSuccessView.createView(requestState.value);
                break;
            }
            case "error": {
                this.setActiveView(this.awaitFailureView);
                if (this.awaitFailureView !== null)
                    this.awaitFailureView.createView(requestState.value);
                break;
            }
        }

    }

    private setRequest(request: Observable<TValue>) {
        if (this._requestSubscription)
            this._requestSubscription.unsubscribe();

        this.setActiveView(null);
        this._request = request.pipe(asAsyncRequest<TValue, TError>());
        this._requestSubscription = this._request.subscribe(req => this.onRequestState(req));
    }

    _setAwaitSuccess(view: IAwaitSuccessView<TValue>) {
        this.awaitSuccessView = view;
    }

    _setAwaitFailure(view: IAwaitFailureView<TError>) {
        this.awaitFailureView = view;
    }

    _setAwaitLoading(view: IAwaitLoadingView) {
        this.awaitLoadingView = view;
    }


}

@Directive({ selector: '[awaitLoading]' })
export class AwaitLoadingDirective<TValue, TError> implements IAwaitLoadingView {

    createView() {
        this.viewContainer.createEmbeddedView(this.templateRef);
    }
    destroyView(): void {
        this.viewContainer.clear();
    }

    constructor(private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Host() ngAsyncAwait: AwaitRequestDirective<TValue, TError>) {

        ngAsyncAwait._setAwaitLoading(this);
    }
}

@Directive({ selector: '[awaitSuccess]' })
export class AwaitSuccessDirective<TValue, TError> implements IAwaitSuccessView<TValue> {

    createView(value: TValue) {
        this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: value, awaitSuccess: value });
    }
    destroyView(): void {
        this.viewContainer.clear();
    }

    @Input()
    set awaitSuccess(context: any) {
    }

    constructor(private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Host() ngAsyncAwait: AwaitRequestDirective<TValue, TError>) {

        ngAsyncAwait._setAwaitSuccess(this);
    }
}


@Directive({ selector: '[awaitFailure]' })
export class AwaitFailureDirective<TValue, TError> implements IAwaitFailureView<TError> {

    createView(value: TError) {
        this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: value, awaitFailure: value });
    }
    destroyView(): void {
        this.viewContainer.clear();
    }

    @Input()
    set awaitFailure(context: any) {
    }

    constructor(private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Host() ngAsyncAwait: AwaitRequestDirective<TValue, TError>) {

        ngAsyncAwait._setAwaitFailure(this);
    }
}
