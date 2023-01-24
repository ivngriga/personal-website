import React from 'react';

export const PHPPaperStack = [
    {
        "title": "PHP Rest API Framework",
        "color": "blanchedalmond",
        "description": "In these slides I will discuss how I achieved the API that you can test below! "
    },
    {
        "title": "Base DB Layer",
        "color": "azure",
        "description": "This is the lowest access point which; the only layer responsible for directly connecting to the PostGreSQL DataBase."
    },
    {
        "title": "User DB Layer",
        "color": "floralwhite",
        "description": "This layer is responsible for creating more complex interactions with the DB, for instance fetching/creating a record or a list of records."
    },
    {
        "title": "Base Controller",
        "color": "aquamarine",
        "description": "This class contains all the functions the developer may need while processing API requests in the main user controller."
    },
    {
        "title": "User Controller",
        "color": "lemonchiffon",
        "description": "The highest layer: this is where the magic happens. Complex requests get broken down into pieces using functions from the User DB Layer and Base Controller. This modular approach is extremely powerful - new functionality is easy to add and the subdivision between the different layers is logical and coherent."
    },
    {
        "title": "Test Slide",
        "color": "lemonchiffon",
        "description": "The highest layer: this is where the magic happens. Complex requests get broken down into pieces using functions from the User DB Layer and Base Controller. This modular approach is extremely powerful - new functionality is easy to add and the subdivision between the different layers is logical and coherent."
    },
    
];