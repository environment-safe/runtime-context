/*
import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/

/**
 * A JSON object
 * @typedef { object } JSON
 */

//todo: jsdoc!
//todo: detect Rhino
import { isBrowser, isNode, isWebWorker, isJsDom, isDeno } from 'browser-or-node';
export { isBrowser, isNode, isWebWorker, isJsDom, isDeno };
export const isElectronRenderer = (
    ( isBrowser || isJsDom ) && 
    typeof window !== 'undefined' && 
    typeof window.process === 'object' && 
    window.process.type === 'renderer'
)?true:false;
        
export const isElectronMain = (
    typeof process !== 'undefined' && 
    typeof process.versions === 'object' && 
    !!process.versions.electron
)?true:false;
    
export const isElectronBrowser = (
    typeof navigator === 'object' && 
    typeof navigator.userAgent === 'string' && 
    navigator.userAgent.indexOf('Electron') >= 0
)?true:false;

export const isHeadlessElectron = 
isElectronRenderer ||
isElectronMain;

export const isElectron = 
    isElectronRenderer ||
    isElectronMain ||
    isElectronBrowser;
    
export const hasHead = ((isBrowser || isJsDom) && !isHeadlessElectron);

export const variables = hasHead?window:global;
export const isBun = !!(variables.Bun && variables.Bun.serve && variables.Bun.file);
export const isLocalFileRoot = hasHead && variables.location && variables.location.protocol === 'file:';
export const isUrlRoot = hasHead && variables.location && (
    variables.location.protocol === 'http:' || variables.location.protocol === 'https:'
);
export const isFtpRoot = hasHead && variables.location && variables.location.protocol === 'ftp:';
export const isServerRoot = !(isLocalFileRoot || isUrlRoot);

export const isClient = hasHead;
export const isServer = isNode || isBun || isDeno || isElectronMain;

// BEGIN detect-browser code (ported here for vanilla compatibility)
// logic is currently black-boxed
// the following code based on: https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts
// ported to browser compatible es modules

class BrowserInfo{
    constructor( name, version, os ){
        this.type = 'browser';
        this.name = name;
        this.version = os;
    }
}

class NodeInfo{
    constructor(version) {
        this.type = 'node';
        this.name = 'node';
        this.os = process.platform;
    }
}

class SearchBotDeviceInfo{
    constructor( name, version, os, bot ){
        this.type = 'bot-device';
    }
}

class BotInfo{
    constructor(){
        this.type = 'bot';
        this.bot = true; // NOTE: deprecated test name instead
        this.name = 'bot';
        this.version = null;
        this.os = null;
    }
}

class ReactNativeInfo{
    constructor(){
        this.type = 'react-native';
        this.name = 'react-native';
        this.version = null;
        this.os = null;
    }
}

class ElectronInfo{
    constructor(){
        this.type = 'electron';
        this.name = 'electron';
        this.version = null;
        this.os = null;
    }
}

/* eslint-disable no-useless-escape */
const SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
const SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
const REQUIRED_VERSION_PARTS = 3;

// many of these obviously require bundled delivery, if you need to target them
const userAgentRules = [
    ['worldwideweb', /CERN-NextStep-WorldWideWeb.app\/([0-9\._]+)/],
    ['cyberdog', /Cyberdog\/([0-9\._]+)/],
    ['lynx', /Lynx\/([0-9\._]+)/],
    ['aol', /AOLShield\/([0-9\._]+)/],
    ['wget', /Wget\/([0-9\._]+)/],
    ['curl', /curl\/([0-9\._]+)/],
    ['edge', /Edge\/([0-9\._]+)/],
    ['edge-ios', /EdgiOS\/([0-9\._]+)/],
    ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
    ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
    ['samsung', /SamsungBrowser\/([0-9\.]+)/],
    ['silk', /\bSilk\/([0-9._-]+)\b/],
    ['miui', /MiuiBrowser\/([0-9\.]+)$/],
    ['beaker', /BeakerBrowser\/([0-9\.]+)/],
    ['edge-chromium', /EdgA?\/([0-9\.]+)/],
    [
        'chromium-webview',
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
    ],
    ['nodejs', /Node\.js/],
    ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
    ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
    ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
    ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
    ['fxios', /FxiOS\/([0-9\.]+)/],
    ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
    ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
    ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
    ['pie',/^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
    ['pie',/^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
    ['netfront',/^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
    ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
    ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
    ['ie', /MSIE\s(7\.0)/],
    ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
    ['android', /Android\s([0-9\.]+)/],
    ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
    ['safari', /Version\/([0-9\._]+).*Safari/],
    ['facebook', /FB[AS]V\/([0-9\.]+)/],
    ['instagram', /Instagram\s([0-9\.]+)/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
    ['curl', /^curl\/([0-9\.]+)$/],
    ['searchbot', SEARCHBOX_UA_REGEX],
];
const operatingSystemRules = [
    ['iOS', /iP(hone|od|ad)/],
    ['AndroidOS', /Android/],
    ['BlackBerry OS', /BlackBerry|BB10/],
    ['Windows Mobile', /IEMobile/],
    ['AmazonOS', /Kindle/],
    ['Windows 3.11', /Win16/],
    ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
    ['Windows 98', /(Windows 98)|(Win98)/],
    ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
    ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
    ['Windows Server 2003', /(Windows NT 5.2)/],
    ['Windows Vista', /(Windows NT 6.0)/],
    ['Windows 7', /(Windows NT 6.1)/],
    ['Windows 8', /(Windows NT 6.2)/],
    ['Windows 8.1', /(Windows NT 6.3)/],
    ['Windows 10', /(Windows NT 10.0)/],
    ['Windows ME', /Windows ME/],
    ['Windows CE', /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
    ['Open BSD', /OpenBSD/],
    ['SunOS', /SunOS/],
    ['ChromeOS', /CrOS/],
    ['Linux', /(Linux)|(X11)/],
    ['Mac OS X', /(Mac OS X)/],
    ['MacOS', /(Mac_PowerPC)|(Macintosh)/],
    ['AmigaOS', /(AmigaOS)/],
    ['QNX', /QNX/],
    ['BeOS', /BeOS/],
    ['OS/2', /OS\/2/],
];
/* eslint-enable no-useless-escape */

function detect(userAgent){
    if(userAgent) return parseUserAgent(userAgent);
    if(
        typeof document === 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative'
    ){
        return new ReactNativeInfo();
    }
    if(isElectronBrowser){
        return new ElectronInfo();
    }
    if(typeof navigator !== 'undefined') return parseUserAgent(navigator.userAgent);
    return getNodeVersion();
}

function matchUserAgent(ua){
    // opted for using reduce here rather than Array#first with a regex.test call
    // this is primarily because using the reduce we only perform the regex
    // execution once rather than once for the test and for the exec again below
    // probably something that needs to be benchmarked though
    return (
        ua !== '' &&
        userAgentRules.reduce((matched, [browser, regex]) => {
            if(matched) return matched;
            const uaMatch = regex.exec(ua);
            return !!uaMatch && [browser, uaMatch];
        }, false)
    );
}

function browserName(ua){
    const data = matchUserAgent(ua);
    return data ? data[0] : null;
}

function parseUserAgent(ua){
    const matchedRule = matchUserAgent(ua);
    if(!matchedRule) return null;
    
    const [name, match] = matchedRule;
    if(name === 'searchbot') return new BotInfo();
    // Do not use RegExp for split operation as some browser do not support it (See: http://blog.stevenlevithan.com/archives/cross-browser-split)
    let versionParts = match[1] && match[1].split('.').join('_').split('_').slice(0, 3);
    if (versionParts) {
        if (versionParts.length < REQUIRED_VERSION_PARTS) {
            versionParts = [
                ...versionParts,
                ...createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length),
            ];
        }
    } else {
        versionParts = [];
    }
    
    const version = versionParts.join('.');
    const os = detectOS(ua);
    const searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
    if (searchBotMatch && searchBotMatch[1]) {
        return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
    }
    if(isElectronMain){
        return new ElectronInfo();
    }
    return new BrowserInfo(name, version, os);
}

function detectOS(ua){
    for(let ii = 0, count = operatingSystemRules.length; ii < count; ii++){
        const [os, regex] = operatingSystemRules[ii];
        const match = regex.exec(ua);
        if (match) return os;
    }
    return null;
}

function getNodeVersion() {
    const isNode = typeof process !== 'undefined' && process.version;
    return isNode ? new NodeInfo(process.version.slice(1)) : null;
}

function createVersionParts(count) {
    const output = [];
    for (let ii = 0; ii < count; ii++) {
        output.push('0');
    }
    return output;
}

// END detect-browser code

const osMap = {
    darwin: 'Mac OS X'
};
const fixServerOSName = (name)=>{
    if(osMap[name.toLowerCase()]) return osMap[name.toLowerCase()];
    return name;
};

const simplifyOSMap = {
    'Windows 3.11': 'windows-legacy',
    'Windows 95': 'windows-legacy',
    'Windows 2000': 'windows-legacy',
    'Windows XP': 'windows-legacy',
    'Windows Server 2003': 'windows-legacy',
    'Windows ME': 'windows-legacy',
    'Windows 7': 'windows',
    'Windows 8': 'windows',
    'Windows 8.1': 'windows',
    'Windows 10': 'windows',
    'Windows Mobile': 'windows-mobile',
    'Windows CE': 'windows-embedded',
    'Mac OS X': 'macosx',
    'BlackBerry OS': 'blackberryos'
};
const simplifyOSName = (name)=>{
    if(simplifyOSMap[name.toLowerCase()]) return simplifyOSMap[name.toLowerCase()];
    return name.toLowerCase();
};
const agent = (variables.navigator && variables.navigator.userAgent) || null;
const detected = detect(agent);
export const runtime = (detected && detected.type === 'browser')?browserName(agent):(
    //now check if we're in an alternate runtime (non-browser)
    isDeno?'deno':(
        isBun?'bun':( detected && detected.type )
    )
);
export const raw = detected;
export const operatingSystem = detected.os?fixServerOSName(detected.os):(
    detected.type == 'browser'?detectOS(agent):'unknown'
);
export const os = simplifyOSName(operatingSystem);
export const flavor = '[UNSUPPORTED]'; //todo: support