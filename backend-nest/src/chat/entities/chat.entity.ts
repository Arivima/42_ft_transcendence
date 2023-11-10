export class Chat {

// 	content				String
// 	timestamp			DateTime
// 	messageID			Int						@id @default(autoincrement())



// 	sender				Player					@relation("Sent", fields: [senderID], references: [id])
// 	senderID			Int
// 	receiver			Player					@relation("Recipient", fields: [receiverID], references: [id])
// 	receiverID			Int
// 	receivers			ChatRoom				@relation("RecipientS", fields: [receiverSID], references: [groupID])
// 	receiverSID			Int
	content: string;
	createdAt: Date;
	senderID: number;
	receiverID: number | null;
	receiversID: number | null;
}
