import clientPromise from './mongodb';
import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

export type User = {
    _id: ObjectId;
    email: string;
    password?: string;
    name?: string;
    emailVerified?: Date | null;
    image?: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const client = await clientPromise;
    const db = client.db('portfolio-data');
    return await db.collection<User>('users').findOne({ email });
}

export async function createUser(data: { email: string; password: string; name: string }): Promise<User> {
    const client = await clientPromise;
    const db = client.db('portfolio-data');
    const hashedPassword = await hash(data.password, 10);

    const result = await db.collection('users').insertOne({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        emailVerified: new Date(),
        image: `https://placehold.co/100x100.png?text=${data.name.charAt(0)}`
    });

    const newUser = await db.collection<User>('users').findOne({ _id: result.insertedId });
    if (!newUser) {
        throw new Error('Could not create user');
    }
    return newUser;
}
