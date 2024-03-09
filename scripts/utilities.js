import * as mc from "@minecraft/server";
import TestRunner from "./tests/test_main";

export default class Utility {
    static debug = false;
    static packNamespace = 'wumpus';

    static init() {
        mc.system.afterEvents.scriptEventReceive.subscribe(event => {
            let event_name = event.id;
            Utility.sendDebugMessage('Received event: ' + event_name + (event.message ? ' ' + event.message : ''));
            // if the event doesn't have the required namespace, ignore it
            if (!event_name.includes(Utility.packNamespace + ':')) {
                return;
            }
            //strip the required namespace off the event name
            Utility.handleDebugCommand(event_name.split(':')[1], event.message);
        });
    }

    static handleDebugCommand(event, message = undefined) {
        if (event === 'debug') {
            Utility.debug = !Utility.debug;
            Utility.sendDebugMessage('Debug mode: ' + Utility.debug);
        }
        else if (event === 'test' && message) {
            if (message === 'list') {
                TestRunner.listTests();
                return;
            }
            TestRunner.runTest(message);
        }
        // register any custom commands you need here
        // else if (event === 'my_custom_command') {
        // 	do things here
        // 	usage in game: /scriptevent wumpus:my_custom_command
        // }
        else {
            // catch any unknown events
            Utility.sendDebugMessage('Unknown event: ' + event);
        }
    }

    static sendDebugMessage(message) {
        if (Utility.debug) {
            mc.world.sendMessage(message);
        }
    }
    static assert(condition, message) {
        if (!condition) {
            Utility.sendDebugMessage(message);
            return false;
        }
        return true;
    }
}
