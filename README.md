# async-request

[![npm version](https://badge.fury.io/js/%40aviellv%2Fasync-request-rxjs-pipe.svg)](https://badge.fury.io/js/%40aviellv%2Fasync-request-rxjs-pipe)
[![Build Status](https://travis-ci.org/avilv/async-request.svg?branch=master)](https://travis-ci.org/avilv/async-request)

A pipe function for rxjs 6+ which emits a three-state 'async-request' with a typed loading/success/error  status object

## Motivation

A common use case for consuming streams is displaying a loading animation, the data itself on success or a failure message when it errors.
This pipe is meant to reduce boiler-plate to a minimum and expose these three states in an easy to consume way.

## Example usage
 
 
```ts

    this.httpQuery$ = this.http.get<string>("./api/text").pipe(asAsyncRequest<string, HttpErrorResponse>());

    this.httpQuery$.subscribe(response => {
      switch (response.state) {
        case "loading":
          showLoadingAnimation();
          break;
        case "success":
          showData(response.value);
          break;
        case "error":
          showError(response.value.message);
          break;
      }
    });
```
it gets even better when binding in views like in angular with the async pipe:

```html

    <span *ngIf="(httpQuery$ | async) as response">
      <ng-container [ngSwitch]="response.state">
        <ng-container *ngSwitchCase="'loading'">loading data...</ng-container>
        <ng-container *ngSwitchCase="'success'">{{response.value}}</ng-container>
        <ng-container *ngSwitchCase="'error'">{{response.value}}</ng-container>
      </ng-container>
    </span>
```
