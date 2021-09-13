"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeBot = void 0;
// Import required Bot Framework classes.
const botbuilder_1 = require("botbuilder");
// Welcomed User property name
const WELCOMED_USER = 'welcomedUserProperty';
class WelcomeBot extends botbuilder_1.ActivityHandler {
    /**
     *
     * @param {UserState} User state to persist boolean flag to indicate
     *                    if the bot had already welcomed the user
     */
    constructor(userState) {
        super();
        // Creates a new user property accessor.
        // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
        this.userState = userState;
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            // Read UserState. If the 'DidBotWelcomedUser' does not exist (first time ever for a user)
            // set the default to false.
            const didBotWelcomedUser = yield this.welcomedUserProperty.get(context, false);
            // Your bot should proactively send a welcome message to a personal chat the first time
            // (and only the first time) a user initiates a personal chat with your bot.
            if (didBotWelcomedUser === false) {
                // The channel should send the user name in the 'From' object
                const userName = context.activity.from.name;
                yield context.sendActivity('You are seeing this message because this was your first message ever sent to this bot.');
                yield context.sendActivity(`It is a good practice to welcome the user and provide personal greeting. For example, welcome ${userName}.`);
                // Set the flag indicating the bot handled the user's first message.
                yield this.welcomedUserProperty.set(context, true);
            }
            else {
                // This example uses an exact match on user's input utterance.
                // Consider using LUIS or QnA for Natural Language Processing.
                const text = context.activity.text.toLowerCase();
                switch (text) {
                    case 'hello':
                    case 'hi':
                        yield context.sendActivity(`You said "${context.activity.text}"`);
                        break;
                    case 'intro':
                    case 'help':
                        yield this.sendIntroCard(context);
                        break;
                    default:
                        yield context.sendActivity(`This is a simple Welcome Bot sample. You can say 'intro' to
                                                    see the introduction card. If you are running this bot in the Bot
                                                    Framework Emulator, press the 'Start Over' button to simulate user joining a bot or a channel`);
                }
            }
            // Save state changes
            yield this.userState.saveChanges(context);
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
        // Sends welcome messages to conversation members when they join the conversation.
        // Messages are only sent to conversation members who aren't the bot.
        this.onMembersAdded((context, next) => __awaiter(this, void 0, void 0, function* () {
            // Iterate over all new members added to the conversation
            for (const idx in context.activity.membersAdded) {
                // Greet anyone that was not the target (recipient) of this message.
                // Since the bot is the recipient for events from the channel,
                // context.activity.membersAdded === context.activity.recipient.Id indicates the
                // bot was added to the conversation, and the opposite indicates this is a user.
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    yield context.sendActivity('Welcome to the \'Welcome User\' Bot. This bot will introduce you to welcoming and greeting users.');
                    yield context.sendActivity(`You are seeing this message because the bot received at least one 'ConversationUpdate' ` +
                        'event, indicating you (and possibly others) joined the conversation. If you are using the emulator, ' +
                        'pressing the \'Start Over\' button to trigger this event again. The specifics of the \'ConversationUpdate\' ' +
                        'event depends on the channel. You can read more information at https://aka.ms/about-botframework-welcome-user');
                    yield context.sendActivity('It is a good pattern to use this event to send general greeting to user, explaining what your bot can do. ' +
                        'In this example, the bot handles \'hello\', \'hi\', \'help\' and \'intro\'. ' +
                        'Try it now, type \'hi\'');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
    }
    sendIntroCard(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = botbuilder_1.CardFactory.heroCard('Welcome to Bot Framework!', 'Welcome to Welcome Users bot sample! This Introduction card is a great way to introduce your Bot to the user and suggest some things to get them started. We use this opportunity to recommend a few next steps for learning more creating and deploying bots.', ['https://aka.ms/bf-welcome-card-image'], [
                {
                    title: 'Get an overview',
                    type: botbuilder_1.ActionTypes.OpenUrl,
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0'
                },
                {
                    title: 'Ask a question',
                    type: botbuilder_1.ActionTypes.OpenUrl,
                    value: 'https://stackoverflow.com/questions/tagged/botframework'
                },
                {
                    title: 'Learn how to deploy',
                    type: botbuilder_1.ActionTypes.OpenUrl,
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-deploy-azure?view=azure-bot-service-4.0'
                }
            ]);
            yield context.sendActivity({ attachments: [card] });
        });
    }
}
exports.WelcomeBot = WelcomeBot;
//# sourceMappingURL=bot.js.map