/* global api */
class mymy_DBP {
    constructor(options) {
        this.options = options;
        this.maxexample = 2;
        this.word = '';
    }

    async displayName() {
        let locale = await api.locale();
        if (locale.indexOf('CN') != -1) return 'Kamus Dewan Bahasa dan Pustaka Edisi-4';
        if (locale.indexOf('TW') != -1) return 'Kamus Dewan Bahasa dan Pustaka Edisi-4';
        return 'Kamus Dewan Bahasa dan Pustaka Edisi-4';
    }


    setOptions(options) {
        this.options = options;
        this.maxexample = options.maxexample;
    }

    async findTerm(word) {
        this.word = word;
        //let deflection = api.deinflect(word);
        let results = await Promise.all([this.findDBP(word)]);
        return [].concat(...results).filter(x => x);
    }

    async findDBP(word) {
        let notes = [];
        if (!word) return notes; // return empty notes

        function T(node) {
            if (!node)
                return '';
            else
                return node.innerText.trim();
        }

        let base = 'https://prpm.dbp.gov.my/Cari1?keyword=';
        let url = base + encodeURIComponent(word);
        let doc = '';
        try {
            let data = await api.fetch(url);
            let parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
        } catch (err) {
            return [];
        }

        let dictionary = doc.querySelector('.panelDBP');
        if (!dictionary) return notes; // return empty notes

        let definition = T(dictionary.querySelector('.tab-pane.fade.in.active'));

        let thesaurus=doc.querySelector('.MainContent_panelresult');
        if (thesaurus){
            //let synonyms=doc.querySelectorAll('querySelectorAll')
            console.log(thesaurus+definition);
        }
        
        // let expression = T(dictionary.querySelector('.h2_entry'));
        // let reading = T(dictionary.querySelector('.pron'));

        // let band = dictionary.querySelector('.word-frequency-img');
        // let bandnum = band ? band.dataset.band : '';
        // let extrainfo = bandnum ? `<span class="band">${'\u25CF'.repeat(Number(bandnum))}</span>` : '';

        // let sound = dictionary.querySelector('a.hwd_sound');
        // let audios = sound ? [sound.dataset.srcMp3] : [];
        // make definition segement
        // let definitions = [];
        // let defblocks = dictionary.querySelectorAll('.hom') || [];
        // for (const defblock of defblocks) {
        //     let pos = T(defblock.querySelector('.pos'));
        //     pos = pos ? `<span class="pos">${pos}</span>` : '';
        //     let eng_tran = T(defblock.querySelector('.sense .def'));
        //     if (!eng_tran) continue;
        //     let definition = '';
        //     eng_tran = eng_tran.replace(RegExp(expression, 'gi'), '<b>$&</b>');
        //     eng_tran = `<span class='eng_tran'>${eng_tran}</span>`;
        //     let tran = `<span class='tran'>${eng_tran}</span>`;
        //     definition += `${pos}${tran}`;

        //     // make exmaple segement
        //     let examps = defblock.querySelectorAll('.sense .cit.type-example') || '';
        //     if (examps.length > 0 && this.maxexample > 0) {
        //         definition += '<ul class="sents">';
        //         for (const [index, examp] of examps.entries()) {
        //             if (index > this.maxexample - 1) break; // to control only 2 example sentence.
        //             let eng_examp = T(examp) ? T(examp).replace(RegExp(expression, 'gi'), '<b>$&</b>') : '';
        //             definition += eng_examp ? `<li class='sent'><span class='eng_sent'>${eng_examp}</span></li>` : '';
        //         }
        //         definition += '</ul>';
        //     }
        //     definition && definitions.push(definition);
        // }
        let css = this.renderCSS();
        notes.push({
            css,
            definition,
        });
        return notes;
    }

    renderCSS() {
        let css = `
            <style>
                span.band {color:#e52920;}
                span.pos  {text-transform:lowercase; font-size:0.9em; margin-right:5px; padding:2px 4px; color:white; background-color:#0d47a1; border-radius:3px;}
                span.tran {margin:0; padding:0;}
                span.eng_tran {margin-right:3px; padding:0;}
                span.chn_tran {color:#0d47a1;}
                ul.sents {font-size:0.8em; list-style:square inside; margin:3px 0;padding:5px;background:rgba(13,71,161,0.1); border-radius:5px;}
                li.sent  {margin:0; padding:0;}
                span.eng_sent {margin-right:5px;}
                span.chn_sent {color:#0d47a1;}
            </style>`;
        return css;
    }
}