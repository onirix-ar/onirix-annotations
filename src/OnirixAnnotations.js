import OxUIService from "./services/oxui.service";
import OnirixEmbedSDK from "@onirix/embed-sdk/dist/ox-embed-sdk.esm.js";

/**
 * Varints of the 3D element
 */
const AnnotationVariants = {
    ACTIVE: "active",
    INNACTIVE: "inactive",
    VISITED: "visited"
}

/**
 * Default name of allowed templates
 */
const TemplateNames = {
    ANNOTATION: "ox-annotation",
    CHECKLIST: "ox-checklist",
    QUESTION: "ox-question"
}

/**
 * Class to access and control annotations from outside
 */
class OnirixAnnotations {

    /**
     * Variables
     */
    uiService = null;
    STORAGE_NAME = null;
    embedSDK = null;
    template = null;
    persist = false;
    visitedAnnotations = [];
    currentElement = null;
    annotationAlreadyVisited = false;
    noDatasheets = "";

    /**
     * Constructor.
     * 
     * @param   sdk to hear events and perfom actions
     * @param   optional information to control the annotations
     */
    constructor(embedSdk, params = { persist: false, template: TemplateNames.ANNOTATION, noDatasheets: "There isn't datasheet in this scene." }) {
        this.uiService = new OxUIService();
        this.embedSDK = embedSdk;
        this.template = params.template ? params.template : TemplateNames.ANNOTATION;
        this.persist = params.persist ? params.persist : false;
        this.noDatasheets = params.noDatasheets ? params.noDatasheets : "There isn't datasheet in this scene.";

        this.uiService.onClose = async () => {
            await this.manageAnnotationsStates();
        }

        this.uiService.onGetImage = async (oid) => {
            return await this.getImage(oid);
        }
        
        this.embedSDK.subscribe(OnirixEmbedSDK.Events.SCENE_LOAD_END, async (params) => {
            const elements = params.elements;
            const hasDatasheets = elements.find(element => element.datasheets.find(datasheet => datasheet.template.name == this.template)) != null;
            if (!hasDatasheets) {
                this.uiService.showNoDatasheetsError(this.noDatasheets);
            }
            await this.init(params);
        });

        this.embedSDK.subscribe(OnirixEmbedSDK.Events.ELEMENT_CLICK, async (params) => {
            this.handleClick(params);
        });

    }

    /**
     * Initialize the storage and prepare the 3D elements
     * 
     * @internal
     * @param   information about the scene 
     */
    async init(params) {
        this.STORAGE_NAME = "ox-annotations-" + params.oid;
            
        if (this.persist) {
            this.visitedAnnotations = localStorage.getItem(this.STORAGE_NAME) ? JSON.parse(localStorage.getItem(this.STORAGE_NAME)) : [];
            if (this.visitedAnnotations.length > 0) {
                for (const annotation of this.visitedAnnotations) {
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
            if (this.currentElement != null) {
                this.uiService.closeSheet(false);
                await this.manageAnnotationsStates();
            }
            this.currentElement = params.name;
            await this.openDatasheet(params);
        }
    }

    /**
     * Apply innactive variant to all elements
     * 
     * @internal
     * @param 3D elements 
     */
    async setInnactiveStatus(elements) {
        if (elements != null) {
            for (const element of elements) {
                if (!this.visitedAnnotations?.includes(element.name)) {
                    await this.embedSDK.setVariant(element.name,  AnnotationVariants.INNACTIVE);
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
        if (this.visitedAnnotations.includes(this.currentElement) && this.annotationAlreadyVisited) {
            this.launchOnInactive();
        } else {
            this.launchOnVisited();
        }
        await this.embedSDK.setVariant(this.currentElement, AnnotationVariants.VISITED);
        this.updateVisitedAnnotations();
        this.currentElement = null;
    }

    /**
     * Set current element as visited.
     * 
     * @internal
     */
    updateVisitedAnnotations() {
        if (!this.visitedAnnotations?.includes(this.currentElement)) {
            this.visitedAnnotations.push(this.currentElement);
        }

        if (this.persist) {
            localStorage.setItem(this.STORAGE_NAME, JSON.stringify(this.visitedAnnotations));
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
    async openDatasheet(params) {
        this.annotationAlreadyVisited = this.visitedAnnotations.includes(this.currentElement);
        this.updateVisitedAnnotations();
        await this.embedSDK.setVariant(params.name, AnnotationVariants.ACTIVE);
        this.uiService.openDatasheet(params.datasheets.filter(datasheet => datasheet.template.name == this.template)[0]);
        if (this.onActive) {
            this.onActive(params.name);
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
}

export default OnirixAnnotations;



