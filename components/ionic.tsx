'use client';

import React from 'react';
import { createComponent } from '@stencil/react-output-target/runtime';
import {
  IonButton as IonButtonElement,
  defineCustomElement as defineIonButtonElement,
} from '@ionic/core/components/ion-button.js';
import {
  IonItem as IonItemElement,
  defineCustomElement as defineIonItemElement,
} from '@ionic/core/components/ion-item.js';

export const IonButton = createComponent({
  defineCustomElement: defineIonButtonElement,
  tagName: 'ion-button',
  elementClass: IonButtonElement,
  react: React,
  events: {
    onIonFocus: 'ionFocus',
    onIonBlur: 'ionBlur',
  },
});

export const IonItem = createComponent({
  defineCustomElement: defineIonItemElement,
  tagName: 'ion-item',
  elementClass: IonItemElement,
  react: React,
  events: {},
});
