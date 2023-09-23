/* global describe:false */
import { chai } from '@environment-safe/chai';
import { it, configure } from '@open-automaton/moka';
import { runtime, os, operatingSystem } from '../src/index.mjs';
const should = chai.should();

//TODO: test suite that hits all targets (instead of the local target)
const runtimes = ['node', 'deno', 'bun', 'browser', 'node', 'bot-device', 'bot', 'react-native', 'aol', 'edge', 'edge-ios', 'yandexbrowser', 'kakaotalk', 'samsung', 'silk', 'miui', 'beaker', 'edge-chromium', 'chrome', 'chromium-webview', 'phantomjs', 'crios', 'firefox', 'fxios', 'opera-mini', 'opera', 'pie', 'netfront', 'ie', 'bb10', 'android', 'ios', 'safari', 'facebook', 'instagram', 'ios-webview', 'curl', 'searchbot'];
const systems = ['iOS', 'Android OS', 'BlackBerry OS', 'Windows Mobile', 'Amazon OS', 'Windows 3.11', 'Windows 95', 'Windows 98', 'Windows 2000', 'Windows XP', 'Windows Server 2003', 'Windows Vista', 'Windows 7', 'Windows 8', 'Windows 8.1', 'Windows 10', 'Windows ME', 'Windows CE', 'Open BSD', 'Sun OS', 'Linux', 'Mac OS', 'Mac OS X', 'QNX', 'BeOS', 'OS/2', 'Chrome OS'];
//todo: break out 'linux' 

describe('module', ()=>{
    describe('performs a simple test suite', ()=>{
        configure({
            dialog : (context, actions)=>{
                actions.confirm();
            } 
        });
        
        it('detects runtime', ()=>{
            should.exist(runtime);
            runtimes.indexOf(runtime).should.not.equal(-1);
        });
        
        it('detects os', ()=>{
            should.exist(os);
            should.exist(operatingSystem);
            systems.indexOf(operatingSystem).should.not.equal(-1);
        });
    });
});

