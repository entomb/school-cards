
const marked = require("marked")
const glob = require("glob")
const handlebars = require('handlebars');
const fs = require('fs');


const INDEX_TPL =  handlebars.compile(fs.readFileSync('./tpl/index.tpl', 'utf8'))
const CARD_TPL =  handlebars.compile(fs.readFileSync('./tpl/card.tpl', 'utf8'))


const words = {
	portugues: "Português",
	ortografia: "Ortografia",
	matematica: "Matemática",
	gramatica: "Gramática",

}

function word(str){
	return words.hasOwnProperty(str) ? words[str] : str
}

function scramble(src){

	var fonts = ["Trebuchet MS", "Arial", "Helvetica", "Comics", "Impact", "Bookman", "Garamond", "Palatino"]

	return src.split(",").map( word => {
		var rand = "1." + Math.round(Math.random()*99)+ "em"
		var font = fonts[Math.floor(Math.random()*fonts.length)];
		return "<span class='word' style='font-size:"+rand+"; font-family:"+font+"'>" + word + "</span>";


	}).join(" ")

}


// marked.setOptions({
//   renderer: new marked.Renderer(),
//   gfm: true,
//   tables: true,
  
//   pedantic: false,
//   sanitize: false,
//   smartLists: true,
//   smartypants: false
// });


marked.setOptions({
	breaks: true,
  highlight: function (code, lang, callback) {

  		if(lang === 'poema'){
  			return "<pre class='poema'>" + code+ "</pre>"	
  		}else if(lang === 'scramble'){
  			return "<div class='scramble'>" + scramble(code) + "</div>"	
  		}else if(lang === 'mermaid'){
				return "<div class='mermaid large'>" +  code + "</div>"	
			}else if(lang === 'mermaid-large'){
			  return "<div class='mermaid large'>" +  code + "</div>"
			}else if(lang === 'mermaid-small'){
			  return "<div class='mermaid small'>" +  code + "</div>"
			}else{
				return code;
			}
  }
});

function getCards(){
	return new Promise((accept, reject) => {
		glob("cards/portugues/**/*.md", function (err, files) {
			if(err) reject(err)
			accept(files)
		})
	})
}


function custom(html){
	return html
	 .replace(/\<td\>\~\<\/td\>/g, "<td class='line'>&nbsp;</td>")
	 .replace(/\●/g, "&nbsp;●&nbsp;")
	 .replace(/pre\>/g, "div>")
	 .replace(/\<em\>__\<\/em\>/g, "<span>_____________</span>")
}

function getCarSubject(path){
	return path.split("/")[1]
}
function getCarSubSubject(path){
	var parts = path.split("/");
	return parts.length ===4 ? parts[2] : parts[1]
}

function getCarNumber(path){
	return path.split("/").reduce((num, item, index, arr) => {
		return num + (index === arr.length-1 ? item.replace(".md","") : item.slice(0,1))
		},"").toUpperCase().slice(1)
}

function _parseCard(card){
	return new Promise((accept, reject) => {
	 	fs.readFile(card, 'utf8', (err, contents) => {
	 		accept(contents)
	 	})
	}).then( contents =>{
		return Promise.resolve({
			tag: [getCarSubSubject(card), getCarSubject(card), getCarNumber(card)].join(" "),
			subject: word(getCarSubject(card)),
			subsubject: word(getCarSubSubject(card)),
			number: getCarNumber(card),
			src: contents,
			html: custom(marked(contents))
		})
	})
}


var Cards = [];
getCards().then(arr => {
	return Promise.all(arr.map(c => _parseCard(c)))
}).then( Cards => {
	fs.writeFile("./build/index.html", INDEX_TPL({Cards}), function(err) {
	    console.log("The file was saved!")
	})
}).catch(console.log.bind(console))
