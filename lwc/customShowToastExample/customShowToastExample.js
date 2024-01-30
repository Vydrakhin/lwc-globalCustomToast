import { LightningElement, wire } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import customShowToast from '@salesforce/messageChannel/customShowToast__c';


export default class CustomShowToastExample extends LightningElement {

    @wire(MessageContext)
    messageContext;

    triggerCustomShowToast(event){
        let payload;
        if(event.target.label == 'Error'){
            payload = {type: 'error', message: 'This is an error', isDismissable: true, body: ['This is the first extended item', 'This is the second']};
        }else if(event.target.label == 'Warning'){
            payload = {type: 'warning', message: 'This is a non disappearing warning', isDismissable: false, body: null};
        }else if(event.target.label == 'Success'){
            payload = {type: 'success', message: 'This is a success without body', isDismissable: true, body: []};
        };
        publish(this.messageContext, customShowToast, payload);
    }
}