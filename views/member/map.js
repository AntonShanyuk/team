function(doc){
    if(doc.type == 'member'){
        emit(doc.name, doc);
    }
}