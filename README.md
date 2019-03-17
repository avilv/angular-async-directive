# angular-async-directive

[![npm version](https://badge.fury.io/js/%40aviellv%2Fangular-async-directive.svg)](https://badge.fury.io/js/%40aviellv%2Fangular-async-directive)
[![Build Status](https://travis-ci.org/avilv/angular-async-directive.svg?branch=master)](https://travis-ci.org/avilv/angular-async-directive)

A pipe function for rxjs 6+ which emits a three-state 'async-request' with a typed loading/success/error  status object

## Motivation

A common use case for consuming async streams is displaying a loading animation, the data itself on success or a failure message when it errors.
This directive is meant to ease this process and allow a quick way to handle all three states (loading,success,failure).

## Example usage
 
 
```ts

    this.httpQuery$ = this.http.get<string>("./api/text");
    
```


```html

    <ng-container [ngAwait]="httpQuery$">
      <ng-container *ngAwaitLoading>loading..</ng-container>   
      <ng-container *ngAwaitSuccess="let data"> data result: {{ data }}</ng-container> 
      <ng-container *ngAwaitFailure="let error"> error has occured: {{ error.message }}</ng-container>
    </ng-container>

```
