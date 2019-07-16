var http = require('http')
var fs = require('fs')
var path = require('path')
var mime = require('mime')
var cache = {}

/**
 * @param {响应} response 
 */
function send404(response) {
    response.writeHead(404, { 'Conent-Type': 'text/plain' })
    response.write('Error 404: resource not found.')
    response.end()
}

/**
 * 发送文件
 * @param {响应} response 
 * @param {文件路径} filePath 
 * @param {文件内容} fileContents 
 */
function sendFile(response, filePath, fileContents) {
    response.writeHead(200, { 'content-type': mime.lookup(path.basename(filePath)) })
    response.end(fileContents)
}

/**
 * 响应静态文件请求
 * @param {响应} response 
 * @param {内存缓存} cache 
 * @param {文件路径} absPath 
 */
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath])
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response)
                    } else {
                        cache[absPath] = data
                        sendFile(response, absPath, data)
                    }
                })
            } else {
                send404(response)
            }
        })
    }
}