/*\
title: $:/plugins/flibbles/uglify/cache.js
module-type: library
type: application/javascript

This exports one file: getFileCacheForTiddler, which behaves like
getCacheForTiddler, except  that its cache is in a file, not in memory.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
'use strict';

exports.getFileCacheForTiddler = function(wiki, title, textKey, method) {
	var processedText = method();
	if (cachingEnabled(wiki)) {
		saveTiddlerCache(title, processedText);
	}
	return processedText;
};

function saveTiddlerCache(title, text) {
	var newTiddler = new $tw.Tiddler({title: title, text: text});
	var filepath = generateCacheFilepath(title);
	var fileInfo = {
		hasMetaFile: false,
		type: 'application/x-tiddler',
		filepath: filepath};
	$tw.utils.saveTiddlerToFile(newTiddler, fileInfo, function(err) {
		console.log("Cached:", title, err);
	});
};

function cachingEnabled(wiki) {
	return wiki.getTiddlerText('$:/config/flibbles/uglify/cache', 'yes') === 'yes';
};

function loadTiddlerCache(title) {
	var path = generateCacheFilepath(title);
	var info = $tw.loadTiddlersFromFile(path);
	if (info.tiddlers.length > 0) {
		var tiddler = info.tiddlers[0];
		return tiddler;
	}
	return undefined;
};

function generateCacheFilepath(title) {
	return $tw.utils.generateTiddlerFilepath(title, {
		extension: ".tid",
		directory: './.cache'});
};
