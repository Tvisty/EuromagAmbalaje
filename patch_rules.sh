sed -i 's/&& data.createdAt == request.time;/&& data.createdAt is timestamp;/g' firestore.rules
