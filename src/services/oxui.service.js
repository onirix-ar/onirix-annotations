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
    NO_DATASHEETS = "ox-no-datasheet";
    CARDS = "ox-cards";
    SUMMARY = "ox-summary";
    SUMMARY_TOGGLE = "summary-toggle";
    QUESTION_CARD = "ox-question-card";
    CORRECT = "ox-correct";
    SUCCESS = "ox-success";
    FAIL = "ox-fail";
    SUMMARY_TOGGLE_ACTIVE = "summary-toggle--active"
    SUMMARY_FINALLY = "ox-summary--finally";
    FINAL_CARD = "ox-question-card--finally";

    /**
     * Constants
     */
    WINDOW_DEVICE_WIDTH = 800;
    MAX_TOP = 96;
    MIN_TOP = 500;
    MIDDLE_TOP = 250;
    QUESTION_POSITION = 0;
    IMG_POSITION = 1;
    FIRST_ANSWER = 2;

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
     * @param   add open full handle
     */
    async addImage(oid, contentElement, showFull = true) {
        const blob = await this.onGetImage(oid);
        const url = URL.createObjectURL(blob);
        const div = document.createElement("div");
        div.style.backgroundImage = `url(${url})`;
        div.classList.add("ox-image");
        contentElement.appendChild(div);
        if (showFull) {
            const full = document.createElement("img");
            full.classList.add(this.EXPAND);
            this.handlerFullOpenImage(full, url);
            contentElement.appendChild(full); 
        }     
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
     * Show a dialog indicating no data sheets have been found
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

    /**
     * Show the cuestion dialog
     * 
     * @param  datasheet info
     */
    async openQuestion(datasheet) {
        const summary = document.getElementById(this.SUMMARY);
        if (summary != null) {
            document.body.removeChild(summary);
        }
        const content = datasheet.content;
        const question = content[this.QUESTION_POSITION];
        
        const container = document.createElement("div");
        container.classList.add(this.QUESTION_CARD)
        this.getQuestionHeader(container, Object.values(question)[0]);

        if (Object.values(content[this.IMG_POSITION])[0] != "") {
            await this.addImage(Object.values(content[this.IMG_POSITION])[0], container, false);
        }

        this.getAnswers(container, content)
        
        const cards = document.createElement("div");
        cards.id = this.CARDS;
        cards.classList.add(this.CARDS);
        container.getElementsByTagName("img")[0].addEventListener("click", (event) => {
            document.body.removeChild(cards);
            this.onAbort();
            const summary = this.onGetSummary();
            if (summary.total == summary.answeredCorrect + summary.answeredFail) {
                if (this.onFinalize) {
                    this.onFinalize(summary);
                }
                document.getElementById(this.SUMMARY_TOGGLE).classList.add(this.SUMMARY_TOGGLE_ACTIVE);
                this.addSummary(summary, true);
            }
        });
        cards.appendChild(container);
        document.body.appendChild(cards);
    }

    /**
     * Add header to question dialog
     * 
     * @internal
     * @param question card 
     * @param question
     */
    getQuestionHeader(container, question) {
        container.innerHTML = `
            <div>
                <div>
                    <div></div>
                    <span>Question</span>
                </div>
                <img />
            </div>
            <p>${question}</p>
        `;
    }

    /**
     * Add answers to the question card
     * 
     * @internal
     * @param question card
     * @param content
     */
    getAnswers(container, content) {
        const ul = document.createElement("ul");
        const correct = content[content.length - 1].answer;
        for (let i = this.FIRST_ANSWER; i < content.length - 1; i++) {
            for (const [key, value] of Object.entries(content[i])) {
                if (value != "") {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <span>${value}</span>
                        <div></div>
                    `;
                    if (key == correct) {
                        li.classList.add(this.CORRECT);
                    }
                    li.addEventListener("click", () => {
                        container.classList.add(this.FINAL_CARD);
                        this.handleCorrect(li);
                    })
                    ul.appendChild(li);
                }
            }
            
        }
        container.appendChild(ul);
    }

    /**
     * Determinates if the selected answer is correct or not
     * 
     * @internal
     * @param answer component 
     */
    handleCorrect(li) {
        const isCorrect = li.classList.contains(this.CORRECT);
        
        if (isCorrect) {
            this.showCorrect(li);
        } else {
            this.showFail(li);
        }
    }

    /**
     * Mark answer as correct
     * 
     * @internal
     * @param   answer element
     */
    showCorrect(li) {
        li.classList.add(this.SUCCESS);
        if (this.onCorrect) {
            this.onCorrect();
        }

    }

    /**
     * Mark the correct and incorrect answer
     * 
     * @internal
     * @param   answer element
     */
    showFail(li) {
        li.classList.add(this.FAIL);
        const cards = document.getElementById(this.CARDS);
        const card = cards.getElementsByClassName(this.QUESTION_CARD)[0];
        card.classList.add(this.FAIL);

        if (this.onIncorrect) {
            this.onIncorrect();
        }

    }

    /**
     * Add summary button to show info about the questions
     */
    addSummaryButton() {
        const div = document.createElement("div");
        div.classList.add(this.SUMMARY_TOGGLE);
        div.id = this.SUMMARY_TOGGLE;
        div.addEventListener("click" , () => {
            if (div.classList.contains(this.SUMMARY_TOGGLE_ACTIVE)) {
                this.closeSummary();
            } else {
                const summary = this.onGetSummary();
                this.addSummary(summary, summary.total == summary.answeredCorrect + summary.answeredFail);
                div.classList.add(this.SUMMARY_TOGGLE_ACTIVE);
            }
            
        });
        document.body.appendChild(div);
    }

    /**
     * Process summary data and show it
     * 
     * @internal
     * @param summary information
     * @param   show final resume
     */
    addSummary(summary, final) {
        const div = document.createElement("div");
        div.classList.add(this.SUMMARY);
        div.id = this.SUMMARY;
        const ansCorrectPercentage = (summary.answeredCorrect / summary.total).toFixed(4) * 100;
        const ansPending = summary.total - (summary.answeredCorrect + summary.answeredFail);
        div.innerHTML = `
        <div>
            ${this.getSummaryHeader(ansCorrectPercentage)}
            <div>
                <span>Questions</span>
                <span>${summary.total - ansPending}/${summary.total}</span>
            </div>
            ${this.getSummaryBody(summary.answeredCorrect, summary.answeredFail, ansPending)}
        </div>
        `;

        if (final) {
            div.classList.add(this.SUMMARY_FINALLY)
            const resume = this.getSummaryFooter(ansCorrectPercentage);
            div.appendChild(resume);
        }
            
        div.getElementsByTagName("img")[0].addEventListener("click", (event) => {
            this.closeSummary();
        });
        document.body.appendChild(div);
    }

    /**
     * Creates summary header
     * 
     * @internal
     * @param percebtage of answered questions
     * @returns html
     */
    getSummaryHeader(ansCorrectPercentage) {
        return `
        <div>
            <div>
                <div></div>
                <span>Summary</span>
            </div>
            <div>
                <span>${ansCorrectPercentage}%</span>
                <div></div>
                <img />
            </div>
        </div>`;
    }

    /**
     * Creates summary body
     * 
     * @internal
     * @param number of correct answered questions
     * @param number of fail answered questions
     * @param number of pending questions
     * @returns html
     */
    getSummaryBody(correct, fail, pending) {
        return `
        <div>
            <div>
                <div>
                    <div></div>
                    <span>Correct</span>
                </div>
                <span>${correct}</span>
            </div>
            <div>
                <div>
                    <div></div>
                    <span>Incorrect</span>
                </div>
                <span>${fail}</span>
            </div>
            <div>
                <div>
                    <div>?</div>
                    <span>Without answering</span>
                </div>
                <span>${pending}</span>
            </div>
        </div>
        `;
    }

    /**
     * Creates summary footer
     * 
     * @internal
     * @param percentage of answered questions
     * @returns html
     */
    getSummaryFooter(ansCorrectPercentage) {
        const resume = document.createElement("div");
        resume.innerHTML = `
            <span>All questions answered!</span>
            <div>
                <span>${ansCorrectPercentage}%</span>
                <div></div>
            </div>
            <button>RESTART QUESTIONS</button>
        `;
        resume.getElementsByTagName("button")[0].addEventListener("click", (event) => {
            this.tryAgain();
            this.closeSummary();
        });
        return resume;
    }

    /**
     * Hide summary dialog
     * 
     * @internal
     */
    closeSummary() {
        const toggle = document.getElementById(this.SUMMARY_TOGGLE);
        const summary = document.getElementById(this.SUMMARY);
        toggle.classList.remove(this.SUMMARY_TOGGLE_ACTIVE);
        document.body.removeChild(summary);
    }

    /**
     * Launch try again event
     * 
     * @internal
     */
    tryAgain() {
        if (this.onTryAgain) {
            this.onTryAgain();
        }
    }
}

export default OxUIService;