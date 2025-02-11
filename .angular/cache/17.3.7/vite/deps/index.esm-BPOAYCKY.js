import {
  deleteToken,
  getToken,
  onMessage
} from "./chunk-VHJKDR2M.js";
import {
  Component,
  ErrorFactory,
  _registerComponent,
  areCookiesEnabled,
  deleteDB,
  firebase,
  getModularInstance,
  isIndexedDBAvailable,
  openDB
} from "./chunk-CV3LCQGV.js";
import {
  __async
} from "./chunk-SFFCLR5V.js";

// node_modules/@firebase/messaging/dist/esm/index.sw.esm2017.js
var DEFAULT_VAPID_KEY = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4";
var ENDPOINT = "https://fcmregistrations.googleapis.com/v1";
var FCM_MSG = "FCM_MSG";
var CONSOLE_CAMPAIGN_ID = "google.c.a.c_id";
var SDK_PLATFORM_WEB = 3;
var EVENT_MESSAGE_DELIVERED = 1;
var MessageType$1;
(function(MessageType2) {
  MessageType2[MessageType2["DATA_MESSAGE"] = 1] = "DATA_MESSAGE";
  MessageType2[MessageType2["DISPLAY_NOTIFICATION"] = 3] = "DISPLAY_NOTIFICATION";
})(MessageType$1 || (MessageType$1 = {}));
var MessageType;
(function(MessageType2) {
  MessageType2["PUSH_RECEIVED"] = "push-received";
  MessageType2["NOTIFICATION_CLICKED"] = "notification-clicked";
})(MessageType || (MessageType = {}));
function arrayToBase64(array) {
  const uint8Array = new Uint8Array(array);
  const base64String = btoa(String.fromCharCode(...uint8Array));
  return base64String.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64ToArray(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
var OLD_DB_NAME = "fcm_token_details_db";
var OLD_DB_VERSION = 5;
var OLD_OBJECT_STORE_NAME = "fcm_token_object_Store";
function migrateOldDatabase(senderId) {
  return __async(this, null, function* () {
    if ("databases" in indexedDB) {
      const databases = yield indexedDB.databases();
      const dbNames = databases.map((db2) => db2.name);
      if (!dbNames.includes(OLD_DB_NAME)) {
        return null;
      }
    }
    let tokenDetails = null;
    const db = yield openDB(OLD_DB_NAME, OLD_DB_VERSION, {
      upgrade: (db2, oldVersion, newVersion, upgradeTransaction) => __async(this, null, function* () {
        var _a;
        if (oldVersion < 2) {
          return;
        }
        if (!db2.objectStoreNames.contains(OLD_OBJECT_STORE_NAME)) {
          return;
        }
        const objectStore = upgradeTransaction.objectStore(OLD_OBJECT_STORE_NAME);
        const value = yield objectStore.index("fcmSenderId").get(senderId);
        yield objectStore.clear();
        if (!value) {
          return;
        }
        if (oldVersion === 2) {
          const oldDetails = value;
          if (!oldDetails.auth || !oldDetails.p256dh || !oldDetails.endpoint) {
            return;
          }
          tokenDetails = {
            token: oldDetails.fcmToken,
            createTime: (_a = oldDetails.createTime) !== null && _a !== void 0 ? _a : Date.now(),
            subscriptionOptions: {
              auth: oldDetails.auth,
              p256dh: oldDetails.p256dh,
              endpoint: oldDetails.endpoint,
              swScope: oldDetails.swScope,
              vapidKey: typeof oldDetails.vapidKey === "string" ? oldDetails.vapidKey : arrayToBase64(oldDetails.vapidKey)
            }
          };
        } else if (oldVersion === 3) {
          const oldDetails = value;
          tokenDetails = {
            token: oldDetails.fcmToken,
            createTime: oldDetails.createTime,
            subscriptionOptions: {
              auth: arrayToBase64(oldDetails.auth),
              p256dh: arrayToBase64(oldDetails.p256dh),
              endpoint: oldDetails.endpoint,
              swScope: oldDetails.swScope,
              vapidKey: arrayToBase64(oldDetails.vapidKey)
            }
          };
        } else if (oldVersion === 4) {
          const oldDetails = value;
          tokenDetails = {
            token: oldDetails.fcmToken,
            createTime: oldDetails.createTime,
            subscriptionOptions: {
              auth: arrayToBase64(oldDetails.auth),
              p256dh: arrayToBase64(oldDetails.p256dh),
              endpoint: oldDetails.endpoint,
              swScope: oldDetails.swScope,
              vapidKey: arrayToBase64(oldDetails.vapidKey)
            }
          };
        }
      })
    });
    db.close();
    yield deleteDB(OLD_DB_NAME);
    yield deleteDB("fcm_vapid_details_db");
    yield deleteDB("undefined");
    return checkTokenDetails(tokenDetails) ? tokenDetails : null;
  });
}
function checkTokenDetails(tokenDetails) {
  if (!tokenDetails || !tokenDetails.subscriptionOptions) {
    return false;
  }
  const { subscriptionOptions } = tokenDetails;
  return typeof tokenDetails.createTime === "number" && tokenDetails.createTime > 0 && typeof tokenDetails.token === "string" && tokenDetails.token.length > 0 && typeof subscriptionOptions.auth === "string" && subscriptionOptions.auth.length > 0 && typeof subscriptionOptions.p256dh === "string" && subscriptionOptions.p256dh.length > 0 && typeof subscriptionOptions.endpoint === "string" && subscriptionOptions.endpoint.length > 0 && typeof subscriptionOptions.swScope === "string" && subscriptionOptions.swScope.length > 0 && typeof subscriptionOptions.vapidKey === "string" && subscriptionOptions.vapidKey.length > 0;
}
var DATABASE_NAME = "firebase-messaging-database";
var DATABASE_VERSION = 1;
var OBJECT_STORE_NAME = "firebase-messaging-store";
var dbPromise = null;
function getDbPromise() {
  if (!dbPromise) {
    dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
      upgrade: (upgradeDb, oldVersion) => {
        switch (oldVersion) {
          case 0:
            upgradeDb.createObjectStore(OBJECT_STORE_NAME);
        }
      }
    });
  }
  return dbPromise;
}
function dbGet(firebaseDependencies) {
  return __async(this, null, function* () {
    const key = getKey(firebaseDependencies);
    const db = yield getDbPromise();
    const tokenDetails = yield db.transaction(OBJECT_STORE_NAME).objectStore(OBJECT_STORE_NAME).get(key);
    if (tokenDetails) {
      return tokenDetails;
    } else {
      const oldTokenDetails = yield migrateOldDatabase(firebaseDependencies.appConfig.senderId);
      if (oldTokenDetails) {
        yield dbSet(firebaseDependencies, oldTokenDetails);
        return oldTokenDetails;
      }
    }
  });
}
function dbSet(firebaseDependencies, tokenDetails) {
  return __async(this, null, function* () {
    const key = getKey(firebaseDependencies);
    const db = yield getDbPromise();
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    yield tx.objectStore(OBJECT_STORE_NAME).put(tokenDetails, key);
    yield tx.done;
    return tokenDetails;
  });
}
function dbRemove(firebaseDependencies) {
  return __async(this, null, function* () {
    const key = getKey(firebaseDependencies);
    const db = yield getDbPromise();
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    yield tx.objectStore(OBJECT_STORE_NAME).delete(key);
    yield tx.done;
  });
}
function getKey({ appConfig }) {
  return appConfig.appId;
}
var ERROR_MAP = {
  [
    "missing-app-config-values"
    /* ErrorCode.MISSING_APP_CONFIG_VALUES */
  ]: 'Missing App configuration value: "{$valueName}"',
  [
    "only-available-in-window"
    /* ErrorCode.AVAILABLE_IN_WINDOW */
  ]: "This method is available in a Window context.",
  [
    "only-available-in-sw"
    /* ErrorCode.AVAILABLE_IN_SW */
  ]: "This method is available in a service worker context.",
  [
    "permission-default"
    /* ErrorCode.PERMISSION_DEFAULT */
  ]: "The notification permission was not granted and dismissed instead.",
  [
    "permission-blocked"
    /* ErrorCode.PERMISSION_BLOCKED */
  ]: "The notification permission was not granted and blocked instead.",
  [
    "unsupported-browser"
    /* ErrorCode.UNSUPPORTED_BROWSER */
  ]: "This browser doesn't support the API's required to use the Firebase SDK.",
  [
    "indexed-db-unsupported"
    /* ErrorCode.INDEXED_DB_UNSUPPORTED */
  ]: "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
  [
    "failed-service-worker-registration"
    /* ErrorCode.FAILED_DEFAULT_REGISTRATION */
  ]: "We are unable to register the default service worker. {$browserErrorMessage}",
  [
    "token-subscribe-failed"
    /* ErrorCode.TOKEN_SUBSCRIBE_FAILED */
  ]: "A problem occurred while subscribing the user to FCM: {$errorInfo}",
  [
    "token-subscribe-no-token"
    /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */
  ]: "FCM returned no token when subscribing the user to push.",
  [
    "token-unsubscribe-failed"
    /* ErrorCode.TOKEN_UNSUBSCRIBE_FAILED */
  ]: "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
  [
    "token-update-failed"
    /* ErrorCode.TOKEN_UPDATE_FAILED */
  ]: "A problem occurred while updating the user from FCM: {$errorInfo}",
  [
    "token-update-no-token"
    /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */
  ]: "FCM returned no token when updating the user to push.",
  [
    "use-sw-after-get-token"
    /* ErrorCode.USE_SW_AFTER_GET_TOKEN */
  ]: "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
  [
    "invalid-sw-registration"
    /* ErrorCode.INVALID_SW_REGISTRATION */
  ]: "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
  [
    "invalid-bg-handler"
    /* ErrorCode.INVALID_BG_HANDLER */
  ]: "The input to setBackgroundMessageHandler() must be a function.",
  [
    "invalid-vapid-key"
    /* ErrorCode.INVALID_VAPID_KEY */
  ]: "The public VAPID key must be a string.",
  [
    "use-vapid-key-after-get-token"
    /* ErrorCode.USE_VAPID_KEY_AFTER_GET_TOKEN */
  ]: "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."
};
var ERROR_FACTORY = new ErrorFactory("messaging", "Messaging", ERROR_MAP);
function requestGetToken(firebaseDependencies, subscriptionOptions) {
  return __async(this, null, function* () {
    const headers = yield getHeaders(firebaseDependencies);
    const body = getBody(subscriptionOptions);
    const subscribeOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    };
    let responseData;
    try {
      const response = yield fetch(getEndpoint(firebaseDependencies.appConfig), subscribeOptions);
      responseData = yield response.json();
    } catch (err) {
      throw ERROR_FACTORY.create("token-subscribe-failed", {
        errorInfo: err === null || err === void 0 ? void 0 : err.toString()
      });
    }
    if (responseData.error) {
      const message = responseData.error.message;
      throw ERROR_FACTORY.create("token-subscribe-failed", {
        errorInfo: message
      });
    }
    if (!responseData.token) {
      throw ERROR_FACTORY.create(
        "token-subscribe-no-token"
        /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */
      );
    }
    return responseData.token;
  });
}
function requestUpdateToken(firebaseDependencies, tokenDetails) {
  return __async(this, null, function* () {
    const headers = yield getHeaders(firebaseDependencies);
    const body = getBody(tokenDetails.subscriptionOptions);
    const updateOptions = {
      method: "PATCH",
      headers,
      body: JSON.stringify(body)
    };
    let responseData;
    try {
      const response = yield fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${tokenDetails.token}`, updateOptions);
      responseData = yield response.json();
    } catch (err) {
      throw ERROR_FACTORY.create("token-update-failed", {
        errorInfo: err === null || err === void 0 ? void 0 : err.toString()
      });
    }
    if (responseData.error) {
      const message = responseData.error.message;
      throw ERROR_FACTORY.create("token-update-failed", {
        errorInfo: message
      });
    }
    if (!responseData.token) {
      throw ERROR_FACTORY.create(
        "token-update-no-token"
        /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */
      );
    }
    return responseData.token;
  });
}
function requestDeleteToken(firebaseDependencies, token) {
  return __async(this, null, function* () {
    const headers = yield getHeaders(firebaseDependencies);
    const unsubscribeOptions = {
      method: "DELETE",
      headers
    };
    try {
      const response = yield fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${token}`, unsubscribeOptions);
      const responseData = yield response.json();
      if (responseData.error) {
        const message = responseData.error.message;
        throw ERROR_FACTORY.create("token-unsubscribe-failed", {
          errorInfo: message
        });
      }
    } catch (err) {
      throw ERROR_FACTORY.create("token-unsubscribe-failed", {
        errorInfo: err === null || err === void 0 ? void 0 : err.toString()
      });
    }
  });
}
function getEndpoint({ projectId }) {
  return `${ENDPOINT}/projects/${projectId}/registrations`;
}
function getHeaders(_0) {
  return __async(this, arguments, function* ({ appConfig, installations }) {
    const authToken = yield installations.getToken();
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-api-key": appConfig.apiKey,
      "x-goog-firebase-installations-auth": `FIS ${authToken}`
    });
  });
}
function getBody({ p256dh, auth, endpoint, vapidKey }) {
  const body = {
    web: {
      endpoint,
      auth,
      p256dh
    }
  };
  if (vapidKey !== DEFAULT_VAPID_KEY) {
    body.web.applicationPubKey = vapidKey;
  }
  return body;
}
var TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1e3;
function getTokenInternal(messaging) {
  return __async(this, null, function* () {
    const pushSubscription = yield getPushSubscription(messaging.swRegistration, messaging.vapidKey);
    const subscriptionOptions = {
      vapidKey: messaging.vapidKey,
      swScope: messaging.swRegistration.scope,
      endpoint: pushSubscription.endpoint,
      auth: arrayToBase64(pushSubscription.getKey("auth")),
      p256dh: arrayToBase64(pushSubscription.getKey("p256dh"))
    };
    const tokenDetails = yield dbGet(messaging.firebaseDependencies);
    if (!tokenDetails) {
      return getNewToken(messaging.firebaseDependencies, subscriptionOptions);
    } else if (!isTokenValid(tokenDetails.subscriptionOptions, subscriptionOptions)) {
      try {
        yield requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token);
      } catch (e) {
        console.warn(e);
      }
      return getNewToken(messaging.firebaseDependencies, subscriptionOptions);
    } else if (Date.now() >= tokenDetails.createTime + TOKEN_EXPIRATION_MS) {
      return updateToken(messaging, {
        token: tokenDetails.token,
        createTime: Date.now(),
        subscriptionOptions
      });
    } else {
      return tokenDetails.token;
    }
  });
}
function deleteTokenInternal(messaging) {
  return __async(this, null, function* () {
    const tokenDetails = yield dbGet(messaging.firebaseDependencies);
    if (tokenDetails) {
      yield requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token);
      yield dbRemove(messaging.firebaseDependencies);
    }
    const pushSubscription = yield messaging.swRegistration.pushManager.getSubscription();
    if (pushSubscription) {
      return pushSubscription.unsubscribe();
    }
    return true;
  });
}
function updateToken(messaging, tokenDetails) {
  return __async(this, null, function* () {
    try {
      const updatedToken = yield requestUpdateToken(messaging.firebaseDependencies, tokenDetails);
      const updatedTokenDetails = Object.assign(Object.assign({}, tokenDetails), { token: updatedToken, createTime: Date.now() });
      yield dbSet(messaging.firebaseDependencies, updatedTokenDetails);
      return updatedToken;
    } catch (e) {
      throw e;
    }
  });
}
function getNewToken(firebaseDependencies, subscriptionOptions) {
  return __async(this, null, function* () {
    const token = yield requestGetToken(firebaseDependencies, subscriptionOptions);
    const tokenDetails = {
      token,
      createTime: Date.now(),
      subscriptionOptions
    };
    yield dbSet(firebaseDependencies, tokenDetails);
    return tokenDetails.token;
  });
}
function getPushSubscription(swRegistration, vapidKey) {
  return __async(this, null, function* () {
    const subscription = yield swRegistration.pushManager.getSubscription();
    if (subscription) {
      return subscription;
    }
    return swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      // Chrome <= 75 doesn't support base64-encoded VAPID key. For backward compatibility, VAPID key
      // submitted to pushManager#subscribe must be of type Uint8Array.
      applicationServerKey: base64ToArray(vapidKey)
    });
  });
}
function isTokenValid(dbOptions, currentOptions) {
  const isVapidKeyEqual = currentOptions.vapidKey === dbOptions.vapidKey;
  const isEndpointEqual = currentOptions.endpoint === dbOptions.endpoint;
  const isAuthEqual = currentOptions.auth === dbOptions.auth;
  const isP256dhEqual = currentOptions.p256dh === dbOptions.p256dh;
  return isVapidKeyEqual && isEndpointEqual && isAuthEqual && isP256dhEqual;
}
function externalizePayload(internalPayload) {
  const payload = {
    from: internalPayload.from,
    // eslint-disable-next-line camelcase
    collapseKey: internalPayload.collapse_key,
    // eslint-disable-next-line camelcase
    messageId: internalPayload.fcmMessageId
  };
  propagateNotificationPayload(payload, internalPayload);
  propagateDataPayload(payload, internalPayload);
  propagateFcmOptions(payload, internalPayload);
  return payload;
}
function propagateNotificationPayload(payload, messagePayloadInternal) {
  if (!messagePayloadInternal.notification) {
    return;
  }
  payload.notification = {};
  const title = messagePayloadInternal.notification.title;
  if (!!title) {
    payload.notification.title = title;
  }
  const body = messagePayloadInternal.notification.body;
  if (!!body) {
    payload.notification.body = body;
  }
  const image = messagePayloadInternal.notification.image;
  if (!!image) {
    payload.notification.image = image;
  }
  const icon = messagePayloadInternal.notification.icon;
  if (!!icon) {
    payload.notification.icon = icon;
  }
}
function propagateDataPayload(payload, messagePayloadInternal) {
  if (!messagePayloadInternal.data) {
    return;
  }
  payload.data = messagePayloadInternal.data;
}
function propagateFcmOptions(payload, messagePayloadInternal) {
  var _a, _b, _c, _d, _e;
  if (!messagePayloadInternal.fcmOptions && !((_a = messagePayloadInternal.notification) === null || _a === void 0 ? void 0 : _a.click_action)) {
    return;
  }
  payload.fcmOptions = {};
  const link = (_c = (_b = messagePayloadInternal.fcmOptions) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : (_d = messagePayloadInternal.notification) === null || _d === void 0 ? void 0 : _d.click_action;
  if (!!link) {
    payload.fcmOptions.link = link;
  }
  const analyticsLabel = (_e = messagePayloadInternal.fcmOptions) === null || _e === void 0 ? void 0 : _e.analytics_label;
  if (!!analyticsLabel) {
    payload.fcmOptions.analyticsLabel = analyticsLabel;
  }
}
function isConsoleMessage(data) {
  return typeof data === "object" && !!data && CONSOLE_CAMPAIGN_ID in data;
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
_mergeStrings("hts/frbslgigp.ogepscmv/ieo/eaylg", "tp:/ieaeogn-agolai.o/1frlglgc/o");
_mergeStrings("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");
function stageLog(messaging, internalPayload) {
  return __async(this, null, function* () {
    const fcmEvent = createFcmEvent(internalPayload, yield messaging.firebaseDependencies.installations.getId());
    createAndEnqueueLogEvent(messaging, fcmEvent, internalPayload.productId);
  });
}
function createFcmEvent(internalPayload, fid) {
  var _a, _b;
  const fcmEvent = {};
  if (!!internalPayload.from) {
    fcmEvent.project_number = internalPayload.from;
  }
  if (!!internalPayload.fcmMessageId) {
    fcmEvent.message_id = internalPayload.fcmMessageId;
  }
  fcmEvent.instance_id = fid;
  if (!!internalPayload.notification) {
    fcmEvent.message_type = MessageType$1.DISPLAY_NOTIFICATION.toString();
  } else {
    fcmEvent.message_type = MessageType$1.DATA_MESSAGE.toString();
  }
  fcmEvent.sdk_platform = SDK_PLATFORM_WEB.toString();
  fcmEvent.package_name = self.origin.replace(/(^\w+:|^)\/\//, "");
  if (!!internalPayload.collapse_key) {
    fcmEvent.collapse_key = internalPayload.collapse_key;
  }
  fcmEvent.event = EVENT_MESSAGE_DELIVERED.toString();
  if (!!((_a = internalPayload.fcmOptions) === null || _a === void 0 ? void 0 : _a.analytics_label)) {
    fcmEvent.analytics_label = (_b = internalPayload.fcmOptions) === null || _b === void 0 ? void 0 : _b.analytics_label;
  }
  return fcmEvent;
}
function createAndEnqueueLogEvent(messaging, fcmEvent, productId) {
  const logEvent = {};
  logEvent.event_time_ms = Math.floor(Date.now()).toString();
  logEvent.source_extension_json_proto3 = JSON.stringify(fcmEvent);
  if (!!productId) {
    logEvent.compliance_data = buildComplianceData(productId);
  }
  messaging.logEvents.push(logEvent);
}
function buildComplianceData(productId) {
  const complianceData = {
    privacy_context: {
      prequest: {
        origin_associated_product_id: productId
      }
    }
  };
  return complianceData;
}
function _mergeStrings(s1, s2) {
  const resultArray = [];
  for (let i = 0; i < s1.length; i++) {
    resultArray.push(s1.charAt(i));
    if (i < s2.length) {
      resultArray.push(s2.charAt(i));
    }
  }
  return resultArray.join("");
}
function onSubChange(event, messaging) {
  return __async(this, null, function* () {
    var _a, _b;
    const { newSubscription } = event;
    if (!newSubscription) {
      yield deleteTokenInternal(messaging);
      return;
    }
    const tokenDetails = yield dbGet(messaging.firebaseDependencies);
    yield deleteTokenInternal(messaging);
    messaging.vapidKey = (_b = (_a = tokenDetails === null || tokenDetails === void 0 ? void 0 : tokenDetails.subscriptionOptions) === null || _a === void 0 ? void 0 : _a.vapidKey) !== null && _b !== void 0 ? _b : DEFAULT_VAPID_KEY;
    yield getTokenInternal(messaging);
  });
}
function onPush(event, messaging) {
  return __async(this, null, function* () {
    const internalPayload = getMessagePayloadInternal(event);
    if (!internalPayload) {
      return;
    }
    if (messaging.deliveryMetricsExportedToBigQueryEnabled) {
      yield stageLog(messaging, internalPayload);
    }
    const clientList = yield getClientList();
    if (hasVisibleClients(clientList)) {
      return sendMessagePayloadInternalToWindows(clientList, internalPayload);
    }
    if (!!internalPayload.notification) {
      yield showNotification(wrapInternalPayload(internalPayload));
    }
    if (!messaging) {
      return;
    }
    if (!!messaging.onBackgroundMessageHandler) {
      const payload = externalizePayload(internalPayload);
      if (typeof messaging.onBackgroundMessageHandler === "function") {
        yield messaging.onBackgroundMessageHandler(payload);
      } else {
        messaging.onBackgroundMessageHandler.next(payload);
      }
    }
  });
}
function onNotificationClick(event) {
  return __async(this, null, function* () {
    var _a, _b;
    const internalPayload = (_b = (_a = event.notification) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[FCM_MSG];
    if (!internalPayload) {
      return;
    } else if (event.action) {
      return;
    }
    event.stopImmediatePropagation();
    event.notification.close();
    const link = getLink(internalPayload);
    if (!link) {
      return;
    }
    const url = new URL(link, self.location.href);
    const originUrl = new URL(self.location.origin);
    if (url.host !== originUrl.host) {
      return;
    }
    let client = yield getWindowClient(url);
    if (!client) {
      client = yield self.clients.openWindow(link);
      yield sleep(3e3);
    } else {
      client = yield client.focus();
    }
    if (!client) {
      return;
    }
    internalPayload.messageType = MessageType.NOTIFICATION_CLICKED;
    internalPayload.isFirebaseMessaging = true;
    return client.postMessage(internalPayload);
  });
}
function wrapInternalPayload(internalPayload) {
  const wrappedInternalPayload = Object.assign({}, internalPayload.notification);
  wrappedInternalPayload.data = {
    [FCM_MSG]: internalPayload
  };
  return wrappedInternalPayload;
}
function getMessagePayloadInternal({ data }) {
  if (!data) {
    return null;
  }
  try {
    return data.json();
  } catch (err) {
    return null;
  }
}
function getWindowClient(url) {
  return __async(this, null, function* () {
    const clientList = yield getClientList();
    for (const client of clientList) {
      const clientUrl = new URL(client.url, self.location.href);
      if (url.host === clientUrl.host) {
        return client;
      }
    }
    return null;
  });
}
function hasVisibleClients(clientList) {
  return clientList.some((client) => client.visibilityState === "visible" && // Ignore chrome-extension clients as that matches the background pages of extensions, which
  // are always considered visible for some reason.
  !client.url.startsWith("chrome-extension://"));
}
function sendMessagePayloadInternalToWindows(clientList, internalPayload) {
  internalPayload.isFirebaseMessaging = true;
  internalPayload.messageType = MessageType.PUSH_RECEIVED;
  for (const client of clientList) {
    client.postMessage(internalPayload);
  }
}
function getClientList() {
  return self.clients.matchAll({
    type: "window",
    includeUncontrolled: true
    // TS doesn't know that "type: 'window'" means it'll return WindowClient[]
  });
}
function showNotification(notificationPayloadInternal) {
  var _a;
  const { actions } = notificationPayloadInternal;
  const { maxActions } = Notification;
  if (actions && maxActions && actions.length > maxActions) {
    console.warn(`This browser only supports ${maxActions} actions. The remaining actions will not be displayed.`);
  }
  return self.registration.showNotification(
    /* title= */
    (_a = notificationPayloadInternal.title) !== null && _a !== void 0 ? _a : "",
    notificationPayloadInternal
  );
}
function getLink(payload) {
  var _a, _b, _c;
  const link = (_b = (_a = payload.fcmOptions) === null || _a === void 0 ? void 0 : _a.link) !== null && _b !== void 0 ? _b : (_c = payload.notification) === null || _c === void 0 ? void 0 : _c.click_action;
  if (link) {
    return link;
  }
  if (isConsoleMessage(payload.data)) {
    return self.location.origin;
  } else {
    return null;
  }
}
function extractAppConfig(app) {
  if (!app || !app.options) {
    throw getMissingValueError("App Configuration Object");
  }
  if (!app.name) {
    throw getMissingValueError("App Name");
  }
  const configKeys = [
    "projectId",
    "apiKey",
    "appId",
    "messagingSenderId"
  ];
  const { options } = app;
  for (const keyName of configKeys) {
    if (!options[keyName]) {
      throw getMissingValueError(keyName);
    }
  }
  return {
    appName: app.name,
    projectId: options.projectId,
    apiKey: options.apiKey,
    appId: options.appId,
    senderId: options.messagingSenderId
  };
}
function getMissingValueError(valueName) {
  return ERROR_FACTORY.create("missing-app-config-values", {
    valueName
  });
}
var MessagingService = class {
  constructor(app, installations, analyticsProvider) {
    this.deliveryMetricsExportedToBigQueryEnabled = false;
    this.onBackgroundMessageHandler = null;
    this.onMessageHandler = null;
    this.logEvents = [];
    this.isLogServiceStarted = false;
    const appConfig = extractAppConfig(app);
    this.firebaseDependencies = {
      app,
      appConfig,
      installations,
      analyticsProvider
    };
  }
  _delete() {
    return Promise.resolve();
  }
};
var SwMessagingFactory = (container) => {
  const messaging = new MessagingService(container.getProvider("app").getImmediate(), container.getProvider("installations-internal").getImmediate(), container.getProvider("analytics-internal"));
  self.addEventListener("push", (e) => {
    e.waitUntil(onPush(e, messaging));
  });
  self.addEventListener("pushsubscriptionchange", (e) => {
    e.waitUntil(onSubChange(e, messaging));
  });
  self.addEventListener("notificationclick", (e) => {
    e.waitUntil(onNotificationClick(e));
  });
  return messaging;
};
function registerMessagingInSw() {
  _registerComponent(new Component(
    "messaging-sw",
    SwMessagingFactory,
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ));
}
function onBackgroundMessage$1(messaging, nextOrObserver) {
  if (self.document !== void 0) {
    throw ERROR_FACTORY.create(
      "only-available-in-sw"
      /* ErrorCode.AVAILABLE_IN_SW */
    );
  }
  messaging.onBackgroundMessageHandler = nextOrObserver;
  return () => {
    messaging.onBackgroundMessageHandler = null;
  };
}
function onBackgroundMessage(messaging, nextOrObserver) {
  messaging = getModularInstance(messaging);
  return onBackgroundMessage$1(messaging, nextOrObserver);
}
registerMessagingInSw();

// node_modules/@firebase/messaging-compat/dist/esm/index.esm2017.js
var name = "@firebase/messaging-compat";
var version = "0.2.10";
function isSupported() {
  if (self && "ServiceWorkerGlobalScope" in self) {
    return isSwSupported();
  } else {
    return isWindowSupported();
  }
}
function isWindowSupported() {
  return typeof window !== "undefined" && isIndexedDBAvailable() && areCookiesEnabled() && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && "fetch" in window && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey");
}
function isSwSupported() {
  return isIndexedDBAvailable() && "PushManager" in self && "Notification" in self && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey");
}
var MessagingCompatImpl = class {
  constructor(app, _delegate) {
    this.app = app;
    this._delegate = _delegate;
    this.app = app;
    this._delegate = _delegate;
  }
  getToken(options) {
    return __async(this, null, function* () {
      return getToken(this._delegate, options);
    });
  }
  deleteToken() {
    return __async(this, null, function* () {
      return deleteToken(this._delegate);
    });
  }
  onMessage(nextOrObserver) {
    return onMessage(this._delegate, nextOrObserver);
  }
  onBackgroundMessage(nextOrObserver) {
    return onBackgroundMessage(this._delegate, nextOrObserver);
  }
};
var messagingCompatFactory = (container) => {
  if (self && "ServiceWorkerGlobalScope" in self) {
    return new MessagingCompatImpl(container.getProvider("app-compat").getImmediate(), container.getProvider("messaging-sw").getImmediate());
  } else {
    return new MessagingCompatImpl(container.getProvider("app-compat").getImmediate(), container.getProvider("messaging").getImmediate());
  }
};
var NAMESPACE_EXPORTS = {
  isSupported
};
function registerMessagingCompat() {
  firebase.INTERNAL.registerComponent(new Component(
    "messaging-compat",
    messagingCompatFactory,
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setServiceProps(NAMESPACE_EXPORTS));
}
registerMessagingCompat();
firebase.registerVersion(name, version);
/*! Bundled license information:

@firebase/messaging/dist/esm/index.sw.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
   * in compliance with the License. You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under the License
   * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   * or implied. See the License for the specific language governing permissions and limitations under
   * the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging-compat/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=index.esm-BPOAYCKY.js.map
