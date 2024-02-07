import DEFAULT_CSS from '../constants/default.css';
import RICH_FIELD_CSS from '../constants/richfield.css';

/**
 * This is a class that manages the UI of the annotations, adds html, controls interaction, etc.
 */
class OxUIService {

    /**
     * HTML elements classes
     */
    ANNOTATIONS = "ox-annotations";
    HEADER = "ox-datasheet__header";
    CONTENT = "ox-datasheet__content";
    SHEET = "ox-datasheet";
    OPENED = "ox-datasheet--open";
    DOWN = "ox-datasheet--down";
    CLOSE = "ox-datasheet--close";
    IMAGE_PREVIEW = "ox-image-preview";
    HORIZONTAL = "ox-image-preview--horizontal";
    VERTICAL = "ox-image-preview--vertical";
    EXPAND = "ox-expand";
    RICH_FIELD = "ox-rich-field";
    NO_DATASHEETS = "ox-no-datasheet"

    /**
     * Constants
     */
    WINDOW_DEVICE_WIDTH = 800;
    MAX_TOP = 96;
    MIN_TOP = 500;
    MIDDLE_TOP = 250;

    /**
     * Variables
     */
    isDragging = false;

    /**
     * Constructor. Add the CSS
     */
    constructor() {
        this.importCss();
    }

    /**
     * Apply the css from the file to the html
     * 
     * @internal
     */
    importCss() {
        const styleElement = document.createElement('style');
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = DEFAULT_CSS;
        } else {
            styleElement.appendChild(document.createTextNode(DEFAULT_CSS));
        }
        document.head.appendChild(styleElement);

        const styleRichFieldElement = document.createElement('style');
        if (styleRichFieldElement.styleSheet) {
            styleRichFieldElement.styleSheet.cssText = RICH_FIELD_CSS;
        } else {
            styleRichFieldElement.appendChild(document.createTextNode(RICH_FIELD_CSS));
        }
        document.head.appendChild(styleRichFieldElement);
        document.body.classList.add(this.ANNOTATIONS);
    }

    /**
     * Creates the datasheet element and add it to the DOM
     * 
     * @param   datasheet element
     */
    async openDatasheet(datasheet) {
        const sheet = document.createElement("div");
        sheet.classList.add(this.SHEET);
        sheet.innerHTML = `
            <div class="ox-datasheet__header">
                <div>
                    <img/>
                    <img/>
                </div>
            </div>
            <div class="ox-datasheet__content">
                <p></p>
                <div></div>
            </div>
        `;
        sheet.getElementsByTagName("div")[0].getElementsByTagName("img")[1].addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.closeSheet();
        });
        sheet.getElementsByTagName("div")[0].getElementsByTagName("img")[0].addEventListener("click", (event) => this.openAllSheet(event));
        this.createDatasheetElements(sheet, datasheet);
        
        document.body.appendChild(sheet);
        if ( window.innerWidth <= this.WINDOW_DEVICE_WIDTH) {
            if (this.isMobile() != null) {
                this.initDragMobile();
            } else {
                this.initDragDesktop();
            }
        }
    }

    /**
     * Creates the diferents elements and add them to the datasheet
     * 
     * @internal
     * @param   datasheet DOM element 
     * @param   datasheet content 
     */
    async createDatasheetElements(sheet, datasheet) {
        let i = 0;
        for (const element of datasheet.template.template) {
            let key = "";
            Object.keys(element).map (k => {
                if (k != "_required") {
                    key = k;
                }   
            });
            const value = element[key];
            const contentValue = datasheet.content[i][key];
            if (contentValue != '') {
                if (key == "Title") {
                    this.addTitle(contentValue, sheet);
                } else if (key == "Subheader") {
                    this.addSubtitle(contentValue, sheet);
                } else {
                    const content = sheet.getElementsByClassName(this.CONTENT)[0].getElementsByTagName("div")[0];
                    if (value == "image") {
                        await this.addImage(contentValue, content);
                    }
                    if (value == "richtext") {
                        this.addTextArea(contentValue, content);
                    }
        
                    if (value == "url") {
                        this.addLink(contentValue, content);
                    }
                }
            }
            
            
            i++;
        }
    }

    /**
     * Expand the datasheet or set it in the middle
     * 
     * @internal
     */
    openAllSheet(event) {
        event.preventDefault();
        event.stopPropagation();
        const sheet = document.getElementsByClassName(this.SHEET)[0];
        if (sheet.classList.contains(this.OPENED)) {
            sheet.classList.remove(this.OPENED);
            sheet.classList.add(this.DOWN);
            sheet.style.top = "380px";
            setTimeout(() => {
                sheet.classList.remove(this.DOWN);
            }, 300)
        } else {
            sheet.classList.add(this.OPENED);
        }
    }

    /**
     * Indicates if the device is a mobile or a desktop device
     * 
     * @internal
     * @returns boolean
     */
    isMobile(){
        return (
            (navigator.userAgent.match(/Android/i)) ||
            (navigator.userAgent.match(/webOS/i)) ||
            (navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i))
        );
    }

    /**
     * Hide the datasheet and emit the corresponding event
     * 
     * @param   emit the event or not
     */
    closeSheet(emit = true) {
        const sheet = document.getElementsByClassName(this.SHEET)[0];
        if (sheet != null) {
            document.body.removeChild(sheet);
            if (this.onClose && emit) {
                this.onClose();
            }
        }
    }

    /**
     * Manages the sheet dragging process when viewed from a mobile
     * 
     * @internal
     */
    initDragMobile() {
        const sheet = document.getElementsByClassName(this.SHEET)[0];
        let resizeData = {}
        sheet.addEventListener('touchstart', (event) => {
            this.isDragging = true;
            resizeData = {
                offset: sheet.offsetTop,
                init: Math.ceil(event.changedTouches[0].pageY),
                current: Math.ceil(event.changedTouches[0].pageY)
            };
        });
        sheet.addEventListener('touchmove', (event) => {
            if(this.isDragging) {
                if (!sheet.classList.contains(this.OPENED)) {
                    const sheetTop = sheet.style.top == "" ? resizeData.offset : parseInt(sheet.style.top.replace("px", ""));
                    if (sheetTop <= this.MIDDLE_TOP) {
                        document.getElementsByClassName(this.SHEET)[0].classList.add(this.OPENED);
                        this.isDragging = false
                    } else {
                        if (sheetTop >= this.MAX_TOP && sheetTop <= this.MIN_TOP) {
                            resizeData.current = Math.ceil(event.changedTouches[0].pageY);
                            const top = resizeData.offset + (resizeData.current - resizeData.init);
                            if (top >= 0) {
                                sheet.style.top = top + "px";
                            }
                        } else if(sheetTop >= this.MIN_TOP) {
                            sheet.classList.add(this.CLOSE);
                            setTimeout(() => {
                                this.isDragging = false;
                                sheet.classList.remove(this.CLOSE);
                                this.closeSheet();
                            }, 300);
                        }
                    } 
                } else {
                    this.isDragging = false;
                }
                     
            }
        });
    }

    /**
     * Manages the sheet dragging process when viewed from a computer
     * 
     * @internal
     */
    initDragDesktop() {
        const sheet = document.getElementsByClassName(this.SHEET)[0];
        sheet.addEventListener("mousedown", (event) => {
            let isDragging = true;
            const resizeData = {
                offset: sheet.offsetTop,
                init: Math.ceil(event.clientY),
                current: Math.ceil(event.clientY)
            };
            document.addEventListener("mousemove", (event) => {
                if (isDragging) {
                    if (!sheet.classList.contains(this.OPENED)) {
                        event.preventDefault();
                        const sheetTop = sheet.style.top == "" ? resizeData.offset : parseInt(sheet.style.top.replace("px", ""));
                        if (sheetTop <= this.MIDDLE_TOP) {
                            document.getElementsByClassName(this.SHEET)[0].classList.add(this.OPENED);
                            isDragging = false
                        } else {
                            if (sheetTop >= this.MAX_TOP && sheetTop <= this.MIN_TOP) {
                                resizeData.current = Math.ceil(event.clientY);
                                const top = resizeData.offset + (resizeData.current - resizeData.init);
                                if (top >= 0) {
                                    sheet.style.top = top + "px";
                                }
                            } else if(sheetTop >= this.MIN_TOP) {
                                sheet.classList.add(this.CLOSE);
                                setTimeout(() => {
                                    isDragging = false;
                                    sheet.classList.remove(this.CLOSE);
                                    this.closeSheet();
                                }, 300);
                            }
                        }
                    } else {
                        isDragging = false;
                    }
                }
            })
            sheet.addEventListener("mouseup", () => {
                isDragging = false;
            })
        })

        
    }

    /**
     * Add the title DOM element to the sheet
     * 
     * @internal
     * @param   title content 
     * @param   sheet DOM element
     */
    addTitle(title, sheetElement) {
        const span = document.createElement("span");
        span.innerText = title;
        const header = sheetElement.getElementsByClassName(this.HEADER)[0];
        header.insertBefore(span, header.firstChild);
    }

    /**
     * Add the subtitle DOM element to the sheet
     * 
     * @internal
     * @param   subtitle content 
     * @param   sheet DOM element
     */
    addSubtitle(subtitle, sheetElement) {
        const subheader = sheetElement.getElementsByClassName(this.CONTENT)[0].firstChild;
        subheader.innerText = subtitle;
    }

    /**
     * Add an image DOM element to the sheet content
     * 
     * @internal
     * @param   identifiedr of the image 
     * @param   sheet content DOM element
     */
    async addImage(oid, contentElement) {
        const blob = await this.onGetImage(oid);
        const url = URL.createObjectURL(blob);
        const div = document.createElement("div");
        div.style.backgroundImage = `url(${url})`;
        contentElement.appendChild(div);
        const full = document.createElement("img");
        full.classList.add(this.EXPAND);
        this.handlerFullOpenImage(full, url);
        contentElement.appendChild(full);        
    }

    /**
     * Add a paragraph DOM element to the sheet content
     * 
     * @internal
     * @param   text content 
     * @param   sheet content DOM element
     */
    addTextArea(text, contentElement) {
        const div = document.createElement("div");
        div.classList.add(this.RICH_FIELD);
        div.innerHTML = text;
        contentElement.appendChild(div);
    }

    /**
     * Add link DOM element to the sheet content
     * 
     * @internal
     * @param   url 
     * @param   sheet content DOM element
     */
    addLink(url, contentElement) {
        const link = document.createElement("a");
        link.href = url;
        link.innerText = "Link";
        contentElement.appendChild(link);
    }

    /**
     * Open the image in a preview mode
     * 
     * @internal
     * @param   DOM element
     * @param   current image src
     */
    handlerFullOpenImage(full, src) {
        full.addEventListener("click", () => {
            const imagePreview = document.createElement("div");
            imagePreview.classList.add(this.IMAGE_PREVIEW);
            const close = document.createElement("img");
            imagePreview.appendChild(close);
            const image = document.createElement("img");
            image.src = src;
            imagePreview.appendChild(image);
            
            setTimeout(() => {
                document.body.appendChild(imagePreview);
                image.classList = [];
                if (image.width > image.height) {
                    image.classList.add(this.HORIZONTAL)
                } else {
                    image.classList.add(this.VERTICAL)
                }
            }, 300);
            close.addEventListener("click", () => {
                document.body.removeChild(imagePreview);
            })
        });
    }

    /**
     * Show a dialog indicating no templates have been found
     * 
     * @param text to show 
     */
    showNoDatasheetsError(message) {
        const div = document.createElement("div");
        div.classList.add(this.NO_DATASHEETS);
        div.innerHTML = `
            <img />
            <p>${message}</p>
        `;
        div.getElementsByTagName("img")[0].addEventListener("click", (event) => {
            document.body.removeChild(div);
        });
        document.body.appendChild(div);
    }
}

export default OxUIService;