function(doc){
    if(doc.type == 'team'){
        emit(doc._id, doc);
    }
    if(doc.type == 'member'){
        if(doc.teams && doc.teams.length){
            for (var i in doc.teams) {
                var teamId = doc.teams[i];
                emit(teamId, doc);
            }
        }
    }
}