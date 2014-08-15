function(doc){
    if(doc.type == 'member'){
        emit(doc._id, doc);
    }
    if(doc.type == 'comment'){
        emit(doc.member, doc);
    }
}