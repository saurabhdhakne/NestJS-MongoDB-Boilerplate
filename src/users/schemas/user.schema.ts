import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'users', versionKey: false })
export class User extends Document {
    
    @Prop({ required: true, unique: true })
    email: string;
    
    @Prop({ required: true })
    firstName: string;
    
    @Prop({ required: true })
    lastName: string;
    
    @Prop({ required: true })
    mode: string;
    
    // bookmarks: Bookmark[],  
}

export const UserSchema = SchemaFactory.createForClass(User);