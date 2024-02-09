import OxUIService from "./services/oxui.service";
import OnirixEmbedSDK from "@onirix/embed-sdk/dist/ox-embed-sdk.esm.js";

/**
 * Varints of the 3D element
 */
const AnnotationVariants = {
    ACTIVE: "active",
    INNACTIVE: "inactive",
    VISITED: "visited",
    CORRECT: "correct",
    INCORRECT: "incorrect"
}

/**
 * Default name of allowed templates
 */
const TemplateNames = {
    CHECKLIST: "ox-checklist",
    QUESTION: "ox-question",
    SEQUENCE: "ox-sequence"
}

/**
 * Class to access and control annotations from outside
 */
class OnirixAnnotationsModule {

    /**
     * Variables
     */
    uiService = null;
    STORAGE_NAME = null;
    embedSDK = null;
    template = null;
    persist = false;
    annotationsPlayed = [];
    currentElement = null;
    annotationAlreadyPlayed = false;
    noDatasheets = "";
    isQuestion = false;
    totalQuestions = 0;

    /**
     * Constructor.
     * 
     * @param   sdk to hear events and perfom actions
     * @param   optional information to control the annotations
     */
    constructor(embedSdk, params = { persist: false, template: TemplateNames.CHECKLIST, noDatasheets: "There isn't datasheet in this scene." }) {
        this.embedSDK = embedSdk;
        this.template = params.template ? params.template : TemplateNames.CHECKLIST;
        this.persist = params.persist ? params.persist : false;
        this.noDatasheets = params.noDatasheets ? params.noDatasheets : "There isn't datasheet in this scene.";
        this.isQuestion = this.template == TemplateNames.QUESTION;
        this.uiService = new OxUIService(this.isQuestion);

        this.uiService.onClose = async () => {
            await this.manageAnnotationsStates();
        }

        this.uiService.onGetImage = async (oid) => {
            return await this.getImage(oid);
        }
        
        this.embedSDK.subscribe(OnirixEmbedSDK.Events.SCENE_LOAD_END, async (params) => {
            if (this.isQuestion) {
                this.uiService.addSummaryButton();
            }
            const elements = params.elements;
            const datasheets = elements.filter(element => element.datasheets.find(datasheet => datasheet.template.name == this.template))
            if (datasheets.length == 0) {
                this.uiService.showNoDatasheetsError(this.noDatasheets);
            } else {
                this.totalQuestions = datasheets.length;
            }
            await this.init(params);
        });

        this.embedSDK.subscribe(OnirixEmbedSDK.Events.ELEMENT_CLICK, async (params) => {
            this.handleClick(params);
        });

        if (this.isQuestion) {
            this.handleQuestionActions();
        }

    }

    /**
     * Initialize the storage and prepare the 3D elements
     * 
     * @internal
     * @param   information about the scene 
     */
    async init(params) {
        this.STORAGE_NAME = "ox-annotations-" + params.oid + "-" + this.template;
            
        if (this.persist) {
            this.annotationsPlayed = localStorage.getItem(this.STORAGE_NAME) ? JSON.parse(localStorage.getItem(this.STORAGE_NAME)) : [];
            if (this.annotationsPlayed.length > 0) {
                for (const annotation of this.annotationsPlayed) {
                    this.currentElement = annotation;
                    await this.manageAnnotationsStates();
                }
            } 
            await this.setInnactiveStatus(params.elements);
        } else {
            await this.setInnactiveStatus(params.elements);
        }
    }

    /**
     * Manages actions when click on a 3D element
     * 
     * @internal
     * @param   information about the clicked element
     */
    async handleClick(params) {
        const datasheets = params.datasheets;
        if (datasheets.length > 0 && datasheets.find(datasheet => datasheet.template.name == this.template)){
            if (this.isQuestion && this.currentElement != null) {
                return;
            }
            if (this.currentElement != null) {
                this.uiService.closeSheet(false);
                await this.manageAnnotationsStates();
            }
            this.currentElement = params.name;
            await this.open(params);
        }
    }

    /**
     * Apply innactive variant to all elements
     * 
     * @internal
     * @param 3D elements 
     */
    async setInnactiveStatus(elements, force = false) {
        if (elements != null) {
            for (const element of elements) {
                if (!this.annotationPlayed(element?.name) || force) {
                    await this.embedSDK.setVariant(element.name ? element.name : element,  AnnotationVariants.INNACTIVE);
                }
            }
        }
    }

    /**
     * Launch events when sheet is closed, apply visited variant and update the visited annotations
     * 
     * @internal
     */
    async manageAnnotationsStates() {
        if (this.annotationPlayed(this.currentElement) && this.annotationAlreadyPlayed) {
            this.launchOnInactive();
        } else {
            this.launchOnVisited();
        }
        if (this.isQuestion) {
            await this.embedSDK.setVariant(this.currentElement.name, this.currentElement.correct ? AnnotationVariants.CORRECT : AnnotationVariants.INCORRECT);
        } else {
            await this.embedSDK.setVariant(this.currentElement, AnnotationVariants.VISITED);
        }

        this.updateAnnotationsPlayed();
        this.currentElement = null;
    }

    /**
     * Set current element as visited.
     * 
     * @internal
     */
    updateAnnotationsPlayed(correct = null) {
        if (!this.annotationPlayed(this.currentElement)) {
            if (correct != null) {
                this.currentElement = {name: this.currentElement, correct: correct};
            }
            this.annotationsPlayed.push(this.currentElement);
        }

        if (this.persist) {
            localStorage.setItem(this.STORAGE_NAME, JSON.stringify(this.annotationsPlayed));
        }        
    }

    /**
     * Launch onInactive custom event.
     * 
     * @internal
     */
    launchOnInactive() {
        if (this.onInactive) {
            this.onInactive(this.currentElement);
        }
    }

    /**
     * Launch onVisited custom event.
     * 
     * @internal
     */
    launchOnVisited() {
        if (this.onVisited) {
            this.onVisited(this.currentElement);
        }
    }

    /**
     * Open the datasheet and launch onActive event
     * 
     * @internal
     * @param   information about the 3D element clicked
     */
    async open(params) {
        this.annotationAlreadyPlayed = this.annotationPlayed(this.currentElement);
        if (this.isQuestion && this.annotationAlreadyPlayed) {
            this.currentElement = null;
            return;
        }
        else if (this.isQuestion && !this.annotationAlreadyPlayed) {
            await this.embedSDK.setVariant(params.name, AnnotationVariants.ACTIVE);
            this.uiService.openQuestion(params.datasheets.filter(datasheet => datasheet.template.name == this.template)[0]);
        } else {
            this.updateAnnotationsPlayed();
            await this.embedSDK.setVariant(params.name, AnnotationVariants.ACTIVE);
            this.uiService.openDatasheet(params.datasheets.filter(datasheet => datasheet.template.name == this.template)[0]);
                
            if (this.onActive) {
                this.onActive(params.name);
            }
        }
    }

    /**
     * Get an image throw embedsdk
     * 
     * @internal
     * @param image identifier
     * @returns blob
     */
    async getImage(oid) {
        return await this.embedSDK.getAssetImage(oid);
    }

    /**
     * Launch onCorrect custom event.
     * 
     * @internal
     */
    launchOnCorrect() {
        if (this.onCorrect) {
            this.onCorrect(this.currentElement);
        }
    }

    /**
     * Launch onIncorrect custom event.
     * 
     * @internal
     */
    launchOnIncorrect() {
        if (this.onIncorrect) {
            this.onIncorrect(this.currentElement);
        }
    }

    /**
     * Checks if the annotation is played or not
     * 
     * @internal
     * @param annotation name 
     * @returns boolean
     */
    annotationPlayed(name) {
        if (this.isQuestion) {
            return this.annotationsPlayed?.find(anno => anno.name == name || anno.name == name.name) != null;
        } else {
            return this.annotationsPlayed?.includes(name)
        }
    }

    /**
     * Get information about the questions and it's states
     * 
     * @internal
     * @returns object
     */
    getSummary() {
        return {
            total: this.totalQuestions,
            answeredCorrect: this.annotationsPlayed.filter(ann => ann.correct).length,
            answeredFail: this.annotationsPlayed.filter(ann => !ann.correct).length
        }
    }

    /**
     * Launch onFinalize custom event.
     * 
     * @internal
     */
    launchOnFinalize(summary) {
        if (this.onFinalize) {
            this.onFinalize(summary);
        }
    }

    /**
     * Reset the questions
     * 
     * @internal
     */
    async tryAgain() {
        this.currentElement = null;
        this.setInnactiveStatus(this.annotationsPlayed, true);
        this.annotationsPlayed = [];
        this.annotationAlreadyPlayed = false;
        if (this.persist) {
            localStorage.removeItem(this.STORAGE_NAME);
        }
    }

    /**
     * Hear actions from the UI
     * 
     * @internal
     */
    handleQuestionActions() {
        this.uiService.onCorrect = async () => {
            this.updateAnnotationsPlayed(true)
            this.launchOnCorrect();
            await this.manageAnnotationsStates();
            this.currentElement = null;
        }

        this.uiService.onIncorrect = async () => {
            this.updateAnnotationsPlayed(false)
            this.launchOnIncorrect();
            await this.manageAnnotationsStates();
            this.currentElement = null;
        }

        this.uiService.onGetSummary = () => {
            return this.getSummary();
        }

        this.uiService.onFinalize = (summary) => {
            this.launchOnFinalize(summary);
        }

        this.uiService.onTryAgain = () => {
            this.tryAgain();
        }

        this.uiService.onAbort = async () => {
            if (this.currentElement) {
                await this.setInnactiveStatus([this.currentElement])
                this.currentElement = null;
            }
        }
    }
}

export default OnirixAnnotationsModule;



