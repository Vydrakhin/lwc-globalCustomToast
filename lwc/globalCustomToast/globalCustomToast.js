import { LightningElement, track, api, wire } from 'lwc';
import customShowToast from '@salesforce/messageChannel/customShowToast__c';
import { loadStyle } from 'lightning/platformResourceLoader';
import fontawesomeResource from '@salesforce/resourceUrl/fontawesome';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';

export default class GlobalCustomToast extends LightningElement {

    subscription = null;
    @track type; // (error, success, warning)
    @track message; // The Main message
    @track body; // An array of String contained in the expandable section
    @track showToastBar = false;
    @api autoCloseTime = 5000; // When you call the component, you can specify the autoCloseTime, by default it is 5 seconds
    @wire(MessageContext)
    messageContext;
    hasBody = false;
    isCloseButtonDisplayed = false;
    isBodyOpen = false;
    chevronCss = 'fa-solid fa-chevron-right';
    bodyTitle = '';
    setTimeoutId;

    connectedCallback() {
        this.subscribeToMessageChannel();
        loadStyle(this, fontawesomeResource + '/css/all.min.css');
        loadStyle(this, fontawesomeResource + '/css/fontawesome.min.css');
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    @api
    showToast(type, message, isDismissable, body) {
        this.closeModal();
        this.type = type;
        this.message = message; 
        this.showToastBar = true;
        if (body && body?.length != 0) {
            switch (type) {
                case 'error':
                    this.bodyTitle = 'Click here to see the detailed error(s)';
                    break;
                case 'success':
                    this.bodyTitle = 'Click here to see more information';
                    break;
                case 'warning':
                    this.bodyTitle = 'Click here to see the detailed warning(s)';
                    break;
                default:
                    this.bodyTitle = 'Click here to see more';
            }
            this.hasBody = true
            this.body = body
        }
        if (isDismissable) {
            this.setTimeoutId =  setTimeout(() => {
                if (!this.isCloseButtonDisplayed) {
                    this.closeModal();
                }
            }, this.autoCloseTime);
        }else{
            this.isCloseButtonDisplayed = true;
        }
    }

    closeModal() {
        this.showToastBar = false;
        this.type = '';
        this.message = '';
        this.bodyTitle ='';
        this.body = null;
        this.hasBody = false;
        this.isCloseButtonDisplayed = false;
        this.isBodyOpen = false;
        clearTimeout(this.setTimeoutId);
        this.setTimeoutId = null;
    }
    
    openBody() {
        this.isBodyOpen = !this.isBodyOpen;
        if (this.isBodyOpen) {
            this.chevronCss = this.chevronCss.replace('right', 'down');
        } else {
            this.chevronCss = this.chevronCss.replace('down', 'right');
        }
    }
    addChevronAnimationOnHover() {
        if (!this.chevronCss.includes(' fa-fade')) {
            this.chevronCss += ' fa-fade';
        }
    }
    removeChevronAnimationOnLeave() {
        this.chevronCss = this.chevronCss.replace(' fa-fade', '');
    }

    get getIconName() {
        return 'utility:' + this.type;
    }

    get innerClass() {
        return 'slds-icon_container slds-icon-utility-' + this.type + ' slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top';
    }

    get outerClass() {
        return 'slds-notify slds-notify_toast slds-theme_' + this.type;
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                customShowToast,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {
        this.showToast(message.type, message.message, message.isDismissable, message.body);
    }

    hasBeenFocusedChange() {
        this.isCloseButtonDisplayed = true;
    }
}