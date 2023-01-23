import React from 'react';

export interface ShortItem{
    title: string,
    description: string,
    path: string
}

export const shortItems: Array<ShortItem> = [
    {
        title: "Widget Info",
        description: "This widget was programmed using: React + TS + css. You can click on the arrows to the bottom right or the titles around the circle to traverse the different subsections.",
        path: ""
    },
    {
        title: "PHP/Rest APIs",
        description: "I have 2+ years of experience in PHP backend development and REST API integration/design. Click 'Learn More' to see a widget showcasing both skills!",
        path: "/php"
    },
    {
        title: "Typescript/React",
        description: "I designed & optimised this website from scratch using React and Typescript. Click 'Learn More' to see more widgets and a deeper explanation of my knowledge.",
        path: "/typescript"
    },
    {
        title: "Python",
        description: "I have 4+ years of experience with python and it is one of my strongest languages. Click 'Learn More' to see a chat widget that allows you to chat with a bot version of me!",
        path: "/python"
    },
    {
        title: "GIT",
        description: "I used git to develop, update, manage and deploy all of my past projects (including this website!) and it is an essential part of my workflow.",
        path: ""
    },
    {
        title: "Problem Solving",
        description: "As a person with a analytical, mathematical background, breaking down complex tasks to understand and subsequently solve them is my forte. ",
        path: ""
    }
];