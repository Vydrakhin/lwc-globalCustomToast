# lwc-globalCustomToast

This project was based on this work : https://cafeforce.com/custom-toast-notification-lwc-salesforce/

The original idea of the creator was to be able to use Toast Notification everywhere.

## This project extends this idea on two sides : 

- Be able to setup the toast component at the root of your LWC and to be able to call it from everywhere, no matter how many level deep.
- Be able to mimic the expandable Salesforce error toast.

## This project contains :

- The component globalCustomToast
- A test component customShowToastExample that can be placed in a record page or in another component to understands the different requirements and possibilities
- The messageChannel designed to be the bridge between the sending component and the receiving component.
- The fontAwesome library

## Setup
- Copy all components and paste them into your project.
