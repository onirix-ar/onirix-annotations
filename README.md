# Onirix Annotations

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Twitter: onirix](https://img.shields.io/twitter/follow/onirix.svg?style=social)](https://twitter.com/onirix)

Onirix Annotations allows you to display information associated with the elements of an Onirix Studio experience in a convenient and simple way.
Simply add dasheets to Studio elements and Onirix Annotations will take care of displaying them when the user clicks on them.

If you want to know more about datasheets and templates in Onirix Studio, take a look at [our documentation about the Datastore module](https://docs.onirix.com/onirix-studio/datastore).


## Install

```sh
npm install @onirix/annotations
```

Include the dependency within the HTML head tag:

```html
<head>
    <script src="https://unpkg.com/@onirix/annotations@1.0.0/dist/ox-annotations.umd.js"/>
</head>
```

As ESM modules:

```js
import OnirixAnnotations from "https://unpkg.com/@onirix/annotations@1.0.0/dist/ox-annotations.esm.js";
```

## Usage

To use this library, first, the embedsdk must be initialize and pass it to the constructor.

```js
import OnirixEmbedSDK from "https://unpkg.com/@onirix/embed-sdk@1.8.0/dist/ox-embed-sdk.esm.js";
import OnirixAnnotations from "https://unpkg.com/@onirix/annotations@1.0.0/dist/ox-annotations.esm.js";

const embedSDK = new OnirixEmbedSDK();
embedSDK.connect();

const oxAnnotations = new OnirixAnnotations(embedSDK);
```

Onirix Annotations can be configured by adding a second parameter to the constructor:

```js
const params = {
    persist: false,
    template: "custom-template-name",
    noDatasheets: "There isn't datasheet in this scene." 
};

const oxAnnotations = new OnirixAnnotationsLib(embedSDK, params);
```

If **persist** is true browser will remember visit elements next time that scene be loaded. If false (default value) all elements be inactive every time the experience loads.

Onirix Annotations will render only datasheets from **template "ox-annotation"** (default value). If you want user other datasheet's template you have to set template's name here.

If no element with datasheets is found, an error message will be displayed. This message can be customized by indicating the text in the **noDatasheets** parameter. If no text is indicated, this will be *There isn't datasheet in this scene.* (default value).

If you need more info about datasheets and templates in Onirix Studio, take a look at [our documentation about the Datastore module](https://docs.onirix.com/onirix-studio/datastore).

## Customize

### Customizing experience elements

You can use any asset in the Onirix Studio experience elements, but if you want the state of the element to change when the datasheet is displayed you must choose an asset that implements the following variants:

- "active" will be the variant to be applied when the datasheet of the element is open.
- "inactive" will be the variant that will be applied when the item's tab is closed and has not been opened before.
- "visited" will be the variant to be applied when the datasheet of the element is closed and has been previously opened.

If you need help with the variants take a look at [our documentation](https://docs.onirix.com/onirix-studio/assets/3d-models/variants#variants).

If your assets do not have variants do not worry. Onirix Annotions provides you with three functions that you can override to make modifications to the experience by showing/hiding the datasheet.

```js
oxAnnotations.onActive = (element) => {
    /**
     * Your code here
     */
}
oxAnnotations.onInactive = (element) => {
    /**
     * Your code here
     */
}

oxAnnotations.onVisited = (element) => {
    /**
     * Your code here
     */
}
```

The three functions receive as parameter the datasheet element that has been shown/hidden. Use our [EmbedSDK](https://www.npmjs.com/package/@onirix/embed-sdk?activeTab=readme) to make changes to the 3D element.


### Customizing CSS

The body has a css class called ox-annotations and the datasheet element has it's own class called ox-datasheet. On the other hand, the dialog that indicates that there are no datasheets uses the class ox-no-datasheet
By employing these selectors, you will be able to customize the style of individual elements under them in the DOM.

To modify the look and feel of the Annotations you can add all the CSS you need to your experience through Onirix Studio's online code editor.

Let's add some code to change the white background of the datasheet and the font.

```css
.ox-annotations .ox-datasheet {
    filter: contrast(150%) brightness(105%);
    background-color: #FABADA;
    color: #6228a7;
}
```

You can make infinite changes to the interface by adding the appropriate CSS selectors. Through your browser's development tools you can explore the names of the css classes used by the library and add your own custom selectors and rules.

## OnirixAnnotations Class

### Methods

This class includes three listener triggering client actions.
When a element is clicked and it has a correct datasheet an event will be launched and you can hear it in your code in this way:

```js
oxAnnotations.onActive = (element) => {
    /**
     * Your code here
     */
}
```

On the other hand, when the datasheet is closed two events can be launched:
- onInactive: when the element had already been visited.
- onVisited: when the element had not been visited.

You can hear both of them in your code:
```js
oxAnnotations.onInactive = (element) => {
    /**
     * Your code here
     */
}

oxAnnotations.onVisited = (element) => {
    /**
     * Your code here
     */
}
```

#### Constructor

The constructor accepts essential data for subscribe to embedsdk events:

```js
constructor(embedSdk, params = { persist: false, template: TemplateNames.ANNOTATION, noDatasheets: "There isn't datasheet in this scene." });
```

- embedSdk: intance of the sdk used in the experience to listen events and perform action in elements.
- params: Object that indicates if the visited annotations must be stored in browser local storage and name of the template used in the datasheets.

## Not enough?

If you want to make deeper changes you can clone the Onirix Annotations code from our [GitHub repository](https://github.com/onirix-ar/onirix-annotations) and create your own Annotations control.


## Author

👤 **Onirix**

* Website: [www.onirix.com](www.onirix.com)
* Twitter: [@onirix](https://twitter.com/onirix)
* Github: [@onirix-ar](https://github.com/onirix-ar)
* LinkedIn: [@onirixar](https://linkedin.com/in/onirixar)
