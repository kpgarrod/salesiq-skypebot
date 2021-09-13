import { ActivityHandler, UserState } from 'botbuilder';
export declare class WelcomeBot extends ActivityHandler {
    private welcomedUserProperty;
    private userState;
    /**
     *
     * @param {UserState} User state to persist boolean flag to indicate
     *                    if the bot had already welcomed the user
     */
    constructor(userState: UserState);
    private sendIntroCard;
}
