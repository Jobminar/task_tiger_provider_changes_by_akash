import {
  isWindowSupported
} from "./chunk-VHJKDR2M.js";
import {
  FIREBASE_APP_NAME,
  FIREBASE_OPTIONS,
  VERSION,
  ɵAngularFireSchedulers,
  ɵapplyMixins,
  ɵcacheInstance,
  ɵfirebaseAppFactory,
  ɵlazySDKProxy
} from "./chunk-R3EZC2YE.js";
import {
  firebase
} from "./chunk-CV3LCQGV.js";
import {
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
  NgZone,
  Optional,
  PLATFORM_ID,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-4VLB7SF7.js";
import {
  EMPTY,
  Observable,
  catchError,
  concat,
  defaultIfEmpty,
  map,
  mergeMap,
  observeOn,
  of,
  shareReplay,
  subscribeOn,
  switchMap,
  switchMapTo
} from "./chunk-T7RKEGOE.js";
import {
  __async
} from "./chunk-SFFCLR5V.js";

// node_modules/@angular/fire/fesm2022/angular-fire-compat-messaging.mjs
var proxyPolyfillCompat = {
  deleteToken: null,
  getToken: null,
  onMessage: null,
  onBackgroundMessage: null
};
var VAPID_KEY = new InjectionToken("angularfire2.messaging.vapid-key");
var SERVICE_WORKER = new InjectionToken("angularfire2.messaging.service-worker-registeration");
var AngularFireMessaging = class _AngularFireMessaging {
  requestPermission;
  getToken;
  tokenChanges;
  messages;
  requestToken;
  deleteToken;
  constructor(options, name, platformId, zone, schedulers, vapidKey, _serviceWorker) {
    const serviceWorker = _serviceWorker;
    const messaging = of(void 0).pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(isWindowSupported), switchMap((supported) => supported ? import("./index.esm-BPOAYCKY.js") : EMPTY), map(() => ɵfirebaseAppFactory(options, zone, name)), switchMap((app) => ɵcacheInstance(`${app.name}.messaging`, "AngularFireMessaging", app.name, () => {
      return of(app.messaging());
    }, [])), shareReplay({
      bufferSize: 1,
      refCount: false
    }));
    this.requestPermission = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(() => Notification.requestPermission()));
    this.getToken = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap((messaging2) => __async(this, null, function* () {
      if (Notification.permission === "granted") {
        const serviceWorkerRegistration = serviceWorker ? yield serviceWorker : null;
        return yield messaging2.getToken({
          vapidKey,
          serviceWorkerRegistration
        });
      } else {
        return null;
      }
    })));
    const notificationPermission$ = new Observable((emitter) => {
      navigator.permissions.query({
        name: "notifications"
      }).then((notificationPerm) => {
        notificationPerm.onchange = () => emitter.next();
      });
    });
    const tokenChange$ = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMapTo(notificationPermission$), switchMapTo(this.getToken));
    this.tokenChanges = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(() => concat(this.getToken, tokenChange$)));
    this.messages = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap((messaging2) => new Observable((emitter) => messaging2.onMessage(emitter))));
    this.requestToken = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(() => this.requestPermission), catchError(() => of(null)), mergeMap(() => this.tokenChanges));
    this.deleteToken = () => messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap((messaging2) => messaging2.deleteToken()), defaultIfEmpty(false));
    return ɵlazySDKProxy(this, messaging, zone);
  }
  static ɵfac = function AngularFireMessaging_Factory(t) {
    return new (t || _AngularFireMessaging)(ɵɵinject(FIREBASE_OPTIONS), ɵɵinject(FIREBASE_APP_NAME, 8), ɵɵinject(PLATFORM_ID), ɵɵinject(NgZone), ɵɵinject(ɵAngularFireSchedulers), ɵɵinject(VAPID_KEY, 8), ɵɵinject(SERVICE_WORKER, 8));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AngularFireMessaging,
    factory: _AngularFireMessaging.ɵfac,
    providedIn: "any"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularFireMessaging, [{
    type: Injectable,
    args: [{
      providedIn: "any"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [FIREBASE_OPTIONS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [FIREBASE_APP_NAME]
    }]
  }, {
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: NgZone
  }, {
    type: ɵAngularFireSchedulers
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [VAPID_KEY]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [SERVICE_WORKER]
    }]
  }], null);
})();
ɵapplyMixins(AngularFireMessaging, [proxyPolyfillCompat]);
var AngularFireMessagingModule = class _AngularFireMessagingModule {
  constructor() {
    firebase.registerVersion("angularfire", VERSION.full, "fcm-compat");
  }
  static ɵfac = function AngularFireMessagingModule_Factory(t) {
    return new (t || _AngularFireMessagingModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _AngularFireMessagingModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [AngularFireMessaging]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularFireMessagingModule, [{
    type: NgModule,
    args: [{
      providers: [AngularFireMessaging]
    }]
  }], () => [], null);
})();
export {
  AngularFireMessaging,
  AngularFireMessagingModule,
  SERVICE_WORKER,
  VAPID_KEY
};
//# sourceMappingURL=@angular_fire_compat_messaging.js.map
