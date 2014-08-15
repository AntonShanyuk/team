function(doc){
    if(doc.type == 'comment'){
        emit(doc.name, doc);
    }
}