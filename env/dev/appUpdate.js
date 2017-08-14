const path    = require('path');
const fs      = require('fs');
const http    = require('http');

class appUpdate {
    
    constructor (config, main) {
        this.main        = main;
        this.remote      = config.remote;
        this.packPath    = config.packPath;
        this.diffJson    = config.diffJson;
        this.fileSuffix  = config.fileSuffix;
        this.localJson   = config.localJson;
        this.messageCode = {};
    }
    
    init () {
        console.log('进来了');
        (async () => {
            const localVerOBJ  = this.localVersion();
            const remoteVerOBJ = await this.remoteVersion()();
            const newVer       = this.watchNewVersion(localVerOBJ, remoteVerOBJ);
            
            const data = {
                localVerOBJ  : localVerOBJ,
                remoteVerOBJ : remoteVerOBJ,
                newVer       : newVer
            }
            
            this.main.send('onCheckRemoteVersion', {
                code : 3000,
                msg  : '',
                data : data
            });
            
        })();
    }
    
    checkUpdate () {
        (async () => {
            const localVerOBJ  = this.localVersion();
            const remoteVerOBJ = await this.remoteVersion()();
            const newVer       = this.watchNewVersion(localVerOBJ, remoteVerOBJ);
            
            if (newVer === true) {
            
            }
            
        })();
    }
    
    update (remoteVerOBJ) {
        this.pullNewVersion(remoteVerOBJ);
    }
    
    localVersion () {
        const verOBJ     = {};
        const verInfo    = fs.readFileSync(this.localJson);
        const verInfoOBJ = JSON.parse(verInfo.toString());
        verOBJ.version   = verInfoOBJ.version;
        verOBJ.minor     = verInfoOBJ.minor;
        return verOBJ;
    }
    
    remoteVersion () {
        
        const getRemote = () => {
            
            return new Promise((resolve, reject) => {
                
                const options = {
                    hostname : this.remote,
                    path     : this.diffJson,
                    port     : '80',
                    method   : 'GET',
                    headers  : {
                        'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
                    }
                };
                
                const req = http.request(options, function (res) {
                    if (res.statusCode === 200) {
                        res.setEncoding('utf8');
                        res.on('data', function (data) {
                            resolve(JSON.parse(data));
                        });
                    } else {
                        this.main.send('appUpdate', {
                            code : 5000,
                            msg  : ''
                        });
                    }
                });
                
                req.on('error', function (e) {
                    reject(e);
                });
                
                req.end();
                
            });
            
        }
        
        return getRemote;
        
    }
    
    watchNewVersion (localVerOBJ, remoteVerOBJ) {
        let localVer  = localVerOBJ.version;
        let remoteVer = remoteVerOBJ.version;
        
        localVer  = localVer.replace(/\./g, '');
        remoteVer = remoteVer.replace(/\./g, '');
        
        let localMinor  = parseInt(localVerOBJ.minor);
        let remoteMinor = parseInt(remoteVerOBJ.minor);
        
        if ((remoteVer < localVer) || (remoteVer === localVer && (remoteMinor < localMinor || remoteMinor === localMinor))) {
            return false;
        } else {
            return true;
        }
        
    }
    
    pullNewVersion (remoteVerOBJ) {
        
        const hostname = this.remote;
        const packName = `v${remoteVerOBJ.version}_${remoteVerOBJ.minor}${this.fileSuffix}`;
        const packPath = this.packPath;
        const download = 'http://' + hostname + packPath + packName;
        const packTemp = `v${remoteVerOBJ.version}_${remoteVerOBJ.minor}.temp`
        
        http.get(download, (res) => {
            let size                = 0;
            const chunks            = [];
            const chunksCountLength = res.headers['content-length'];
            res.on('data', (chunk) => {
                size += chunk.length;
                chunks.push(chunk);
                this.main.send('onUpdateding', {
                    code : 4000,
                    msg  : '',
                    data : size / chunksCountLength
                });
            });
            res.on('end', () => {
                console.log('完毕');
                const data = Buffer.concat(chunks, size);
                fs.writeFile(path.join(__dirname, packTemp), data, (err) => {
                    if (err) {
                        throw err;
                    }
                    fs.rename(path.join(__dirname, packTemp), path.join(__dirname, packName), (err) => {
                        if (err) {
                            throw err;
                        }
                        this.writeNewVersionToConfig(remoteVerOBJ);
                    })
                });
                
            });
        }).on('error', (e) => {
            console.log('Got error: ' + e.message);
        });
        
    }
    
    writeNewVersionToConfig (remoteVerOBJ) {
        
        const verInfo         = fs.readFileSync(this.localJson);
        const verInfoOBJ      = JSON.parse(verInfo.toString());
        verInfoOBJ.version    = remoteVerOBJ.version;
        verInfoOBJ.minor      = remoteVerOBJ.minor;
        const newVerOBJ       = JSON.stringify(verInfoOBJ);
        
        fs.writeFile(path.join(__dirname, 'package.json'), newVerOBJ, (err) => {
            if (err) {
                console.error(err);
            } else {
                this.main.send('onUpdateDone', {
                    code : 4003,
                    msg  : ''
                });
            }
        });
    }
    
}

module.exports = appUpdate;
