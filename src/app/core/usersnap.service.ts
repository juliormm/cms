import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class UsersnapService {

  constructor(@Inject(DOCUMENT) private document: HTMLDocument) {
    (function() {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = '//api.usersnap.com/load/ece571c7-a5ad-4176-8959-707112c69325.js';
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
     }
    )();
  }
}
