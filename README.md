# Onirix Annotations

![Version](https://img.shields.io/badge/version-2.0.4-blue.svg?cacheSeconds=2592000)
[![Twitter: onirix](https://img.shields.io/twitter/follow/onirix.svg?style=social)](https://twitter.com/onirix)

Onirix Annotations allows you to display information associated with the elements of an Onirix Studio experience in a convenient and simple way.
Simply add dasheets to Studio elements and Onirix Annotations will take care of displaying them when the user clicks on them.

Onirix Annotations has several modes of operation depending on the data structure you use in your experience. 

[The **ox-checklist** data structure](https://docs.onirix.com/modules/onirix-annotations-checklist) allows us to attach visual cues to your elements in your AR experiences. These cues can be used to mark areas of a digital twin, or areas of interest in a space, for example.

[The **ox-question** data structure](https://docs.onirix.com/modules/onirix-annotations-questions) allows us to attach questions about the elements they are highlighting in the 3D model or Space, perfect for training modules in installations, products, digital twins, scurity dynamics, etc. It also includes a summary component, that can be consulted to review the general status of the test in progress (amount of answers, percentage of success).


Through the scene editor you can configure data sheets with questions for each element of the experience.
Onirix Annotations will take care of displaying the question to the user and process the answer.

If you want to know more about data sheets and data structures in Onirix Studio, take a look at [our documentation about the Datastore module](https://docs.onirix.com/onirix-studio/datastore).


## Install

```sh
npm install @onirix/annotations-module
```

Include the dependency within the HTML head tag:

```html
<head>
    <script src="https://unpkg.com/@onirix/annotations-module@2.0.4/dist/ox-annotations-module.umd.js"/>
</head>
```

As ESM modules:

```js
import OnirixAnnotationsModule from "https://unpkg.com/@onirix/annotations-module@2.0.4/dist/ox-annotations-module.esm.js";
```

## Usage

To use this library, first, the embedsdk must be initialize and pass it to the constructor.

```js
import OnirixEmbedSDK from "https://unpkg.com/@onirix/embed-sdk@1.8.0/dist/ox-embed-sdk.esm.js";
import OnirixAnnotationsModule from "https://unpkg.com/@onirix/annotations-module@2.0.4/dist/ox-annotations-module.esm.js";

const embedSDK = new OnirixEmbedSDK();
embedSDK.connect();

const oxAnnotations = new OnirixAnnotationsModule(embedSDK);
```

Onirix Annotations can be configured by adding a second parameter to the constructor:

```js
const params = {
    persist: false,
    template: "custom-data-structure-name",
    noDatasheets: "There isn't data sheet in this scene." 
};

const oxAnnotations = new OnirixAnnotationsModule(embedSDK, params);
```

If **persist** is true browser will remember visit elements next time that scene be loaded. If false (default value) all elements be inactive every time the experience loads.

The **template** parameter allows you to indicate to Onirix Annotations the data structure it will find in your experience. It currently supports two predefined data structures.

If no element with data sheets is found, an error message will be displayed. This message can be customized by indicating the text in the **noDatasheets** parameter. If no text is indicated, this will be *There isn't data sheets in this scene.* (default value).

### Predefined data structures

#### Onirix Checklist

To use this mode your experience data sheets must use the data structure **ox-checklist**. Remember that in this mode will render only data sheets from **data structure "ox-checklist"** (default value).

To initialize Onirix Annotations in checklist mode, simply do not specify the data structure of your experience datasheets (this is the default option).

```js
// Default option
const oxAnnotations = new OnirixAnnotationsModule(embedSDK, params);

// Setting the template name
const oxAnnotations = new OnirixAnnotationsModule(embedSDK, {template: 'ox-checklist'});
```

Check our [documentation](https://docs.onirix.com/modules/onirix-annotations-checklist) to know more about **ox-checklist** mode

#### Onirix Question

To use this mode your experience data sheets must use the data structure **ox-question**.

```js
// Setting the template name
const oxAnnotations = new OnirixAnnotationsModule(embedSDK, {template: 'ox-question'});

```

Check our [documentation](https://docs.onirix.com/modules/onirix-annotations-questions) to know more about **ox-question** mode

## Customize

### Customizing experience elements

You can use any asset in the Onirix Studio experience elements, but if you want the state of the element to change when the data sheet is displayed you must choose an asset that implements the following variants:

- "active" will be the variant to be applied when the data sheet of the element is open.
- "inactive" will be the variant that will be applied when the item's tab is closed and has not been opened before.
- "visited" will be the variant to be applied when the data sheet of the element is closed and has been previously opened.
- "correct" will be the variant to be applied when a question is answered successfully.
- "incorrect" will be the variant to be applied when a question is anwered incorrectly.

If you need help with the variants take a look at [our documentation](https://docs.onirix.com/onirix-studio/assets/3d-models/variants#variants).

If your assets do not have variants do not worry. Onirix Annotions provides you with six functions that you can override to make modifications to the experience by showing/hiding the data sheet or the questions state.

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

oxAnnotations.onCorrect = (element) => {
    /**
     * Your code here
     */
}

oxAnnotations.onIncorrect = (element) => {
    /**
     * Your code here
     */
}

oxAnnotations.onFinalize = (summary) => {
    /**
     * Your code here
     */
}
```

The three functions receive as parameter the data sheet element that has been shown/hidden. Use our [EmbedSDK](https://www.npmjs.com/package/@onirix/embed-sdk?activeTab=readme) to make changes to the 3D element.


### Customizing CSS

The body has a css class called ox-annotations and the data sheet element has it's own class called ox-datasheet. On the other hand, the dialog that indicates that there are no data sheets uses the class ox-no-datasheet.
If you are using the questionnaire mode, there are three diferent classes:

- ox-cards: It includes the dialogues for the question and its correction.
- summary-toggle: The button that shows the summary.
- ox-summary: The dialog containing the summary.

By employing these selectors, you will be able to customize the style of individual elements under them in the DOM.

To modify the look and feel of the Annotations you can add all the CSS you need to your experience through Onirix Studio's online code editor.

Let's add some code to change the white background of the data sheet and the font.

```css
.ox-annotations .ox-datasheet {
    filter: contrast(150%) brightness(105%);
    background-color: #FABADA;
    color: #6228a7;
}
```

If you are using the questionnaire data structures you can customize the questions and the summary with the following classes:

```css
.ox-question-card > div {
    filter: contrast(150%) brightness(105%);
    background-color: #FABADA;
    color: #6228a7;
}

.ox-summary > div {
    filter: contrast(150%) brightness(105%);
    background-color: #FABADA;
    color: #6228a7;
}

```

You can make infinite changes to the interface by adding the appropriate CSS selectors. Through your browser's development tools you can explore the names of the css classes used by the library and add your own custom selectors and rules.

## OnirixAnnotationsModule Class

### Methods

This class includes six listener triggering client actions.
When a element is clicked and it has a correct data sheet an event will be launched and you can hear it in your code in this way:

```js
oxAnnotations.onActive = (element) => {
    /**
     * Your code here
     */
}
```

On the other hand, when the data sheet is closed two events can be launched:
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

When the mode is questionnaire three events are launched:

- onCorrect: when a question is answered correctly.
- onIncorrect: when a question is answered incorrectly.
- onFinalize: when all questions are answered.

To hear them you can do this is yout code:
```js
oxAnnotations.onCorrect = (element) => {
    /**
     * Your code here
     */
}

oxAnnotations.onIncorrect = (element) => {
    /**
     * Your code here
     */
}

oxAnnotations.onFinalize = (summary) => {
    /**
     * Your code here
     */
}
```

#### Constructor

The constructor accepts essential data for subscribe to embedsdk events:

```js
constructor(embedSdk, params = { persist: false, template: "ox-checklist", noDatasheets: "There isn't data sheets in this scene." });
```

- embedSdk: intance of the sdk used in the experience to listen events and perform action in elements.
- params: Object that indicates if the visited annotations must be stored in browser local storage and name of the data structure used in the data sheets.

## Not enough?

If you need help take a look at our documentation about:

- ["ox-checklist" mode](https://docs.onirix.com/modules/onirix-annotations-checklist).
- ["ox-question" mode](https://docs.onirix.com/modules/onirix-annotations-questions).
- [Datastore module (data structures and data sheets)](https://docs.onirix.com/onirix-studio/datastore).


If you want to make deeper changes you can clone the Onirix Annotations code from our [GitHub repository](https://github.com/onirix-ar/onirix-annotations) and create your own Annotations control.


## Author

👤 **Onirix**

* Website: [www.onirix.com](www.onirix.com)
* Twitter: [@onirix](https://twitter.com/onirix)
* Github: [@onirix-ar](https://github.com/onirix-ar)
* LinkedIn: [@onirixar](https://linkedin.com/in/onirixar)
