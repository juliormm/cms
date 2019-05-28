import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { creativeDataGroup } from '../_interfaces/campaign.interface';


export interface IsizeIds {
	[key: string]: any[];
}

export interface IcampaignCrvs {
	RichMedia?: IsizeIds;
	Standard?: IsizeIds;
	Static?: IsizeIds;
	Email?: IsizeIds;

}


@Injectable()
export class AddCreativeTrackService {

	itemList = [];
	private duplicatesNamesSubject = new Subject();
	dupNames$ = this.duplicatesNamesSubject.asObservable();

	private duplicatesCreativeSubject = new Subject();
	dupCrv$ = this.duplicatesCreativeSubject.asObservable();

	// private clearCreativeSubject = new Subject();
	// clearCrv$ = this.clearCreativeSubject.asObservable();


	constructor() {}
	
	clearList() {
		this.itemList = [];
	}

	addCreative(index, data, ckDups = true) {
		// console.log('service request addCreative')
		const catName = data.type + data.size;
		const found = this.itemList.find(elm => elm.id === index);
		const crvName = (data.name) ? data.name.toLowerCase() : '';

		const crvObj = { name: crvName, id: index, cat: catName};
		// console.log(crvObj)
		if (found) {
			this.itemList.map(elm => {
				if (elm.id === index) {
					elm.name = crvName;
					elm.cat = catName;
				}
			});

		} else {
			this.itemList.push(crvObj);
		}

		if (ckDups && this.itemList.length > 1 ) {
			this.runDups(catName)
		}
	}



	removeCreative(index) {
		const idx = this.itemList.findIndex(val => val.id == index);
		this.itemList.splice(idx, 1);
		// console.log()
		// this.runDups(this.itemList[idx].cat)
		this.runFindDups();
	}

	// runDupName() {
	// 	this.sortList();
	// 	const dups = this.findCrvName();
	// 	this.duplicatesNamesSubject.next(dups);
	// }
	// 
	runFindDups(){
		const cats = Array.from(new Set(this.itemList.map((item: any) => item.cat)))
		if(cats.length > 0){
			cats.forEach(item =>{
				this.runDups(item)
			});
		}	
	}

	runDups(catName) {
		this.sortList();
		const dups = this.findCrvDups();
		this.duplicatesCreativeSubject.next(dups);
		// if(this.itemList.length > 1){
		// 	const matched = this.itemList.filter(items => items.cat === catName);
		// 	const ids = [];
		// 	matched.forEach(item => {
		// 		ids.push(item.id);
		// 	});
			
		// 	if(ids.length > 1){
		// 		// console.log(ids)
		// 		this.duplicatesCreativeSubject.next(ids);
		// 	}
			
		// }
		
	}

	validateCustomName(data) {
		const crv = this.itemList.find(elm => elm.id === data.index);
		crv.name = data.value;
		const found = this.itemList.find(m => m.id !== crv.id && m.cat === crv.cat && m.name.toLowerCase() === crv.name.toLowerCase());
		// console.log('matches', found)
		if(found){
			this.duplicatesNamesSubject.next([found.id, crv.id]);
		} else {
			this.duplicatesNamesSubject.next([]);
		}

		// console.log(this.itemList)
		// this.sortList();
		// this.runDupName();
	}

	pushPrevieousCreatives(data: creativeDataGroup[]) {
	// loop for all ad add to the itemelist, so make pattern from passed data
		// console.log('before')
		// console.log(this.itemList)
		data.forEach(objs => {
			objs.items.forEach(crvInfo => {
				// console.log('processing... ', crvInfo)
				let newSize = crvInfo.size;
				const findName = crvInfo.name.match(/-{2}(.*)-{2}/);
				const crvName = (findName) ? findName[1] :  '';
				if (crvInfo.type === 'RichMedia' && crvInfo.features) {
		            newSize = (crvInfo.features.some(elm => elm === 'video')) ? crvInfo.size + '_vid' : crvInfo.size;
		            newSize = (crvInfo.features.some(elm => elm === 'expandable')) ? newSize + '_exp' : newSize;
		        }

				this.itemList.push({ name: crvName, id: crvInfo.crv_id, cat: crvInfo.type+newSize })
			});
		});
		
		// console.log('after')
		// console.log(this.itemList)
	}

	private sortList() {
		this.itemList.sort(function(a, b) {
			const val = (a.cat > b.cat) ? 1 : ((b.cat > a.cat) ? -1 : 0);
			if (val === 0) {
				return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);
			}
			return val;
		});

		// console.log('sorted', this.itemList) 
	}

	private findCrvDups() {
		const dups = [];
		for (let i = 1; i < this.itemList.length; i++) {
			const a = this.itemList[i - 1];
			const b = this.itemList[i];
			if (a.cat.toLowerCase() == b.cat.toLowerCase()) {
				if (!dups.includes(a.id)) {
					dups.push(a.id);
				}
				if (!dups.includes(b.id)) {
					dups.push(b.id);
				}
			}
		}

		return dups;
	}

	// private findCrvName(_name?, _type?) {
	// 	const dups = [];

	// 	// if(_name && _type){

	// 	// } else {
	// 		for (let i = 1; i < this.itemList.length; i++) {
	// 			const a = this.itemList[i - 1];
	// 			const b = this.itemList[i];

	// 			if (a.name.toLowerCase() == b.name.toLowerCase() && a.cat == b.cat) {
	// 				console.log('comparing: ', a.name, b.name)
	// 				if (!dups.includes(a.id)) {
	// 					dups.push(a.id);
	// 				}
	// 				if (!dups.includes(b.id)) {
	// 					dups.push(b.id);
	// 				}
	// 			}
	// 		}
	// 	// }
		
	// 	// 
		
	// 	// const typeList = this.itemList.filter(item => item.cat === _type);

	// 	// console.log('narrow type is:', typeList)

	// 	// if


	// 	return dups;
	// }
}
