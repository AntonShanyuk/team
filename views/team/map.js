function(doc){
	if(doc.type == 'team'){
		emit(doc.name, doc);
	}
}