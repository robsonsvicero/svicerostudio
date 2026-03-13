const { MongoClient, ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const uri = 'mongodb+srv://svicerostudio_db_user:v2jqed63qV6W4Tj8@cluster0.phx8ywv.mongodb.net/svicerostudio?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'svicerostudio';

async function migrate() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const posts = db.collection('posts');

    // Busca todos os posts com _id do tipo ObjectId
    const cursor = posts.find({ _id: { $type: 'objectId' } });
    let count = 0;

    while (await cursor.hasNext()) {
  const post = await cursor.next();
  const oldId = post._id;
  const newId = uuidv4();

  // Remove o campo _id para poder inserir como novo documento
  delete post._id;
  post._id = newId;

  // Remova o documento antigo ANTES de inserir o novo
  await posts.deleteOne({ _id: oldId });

  // Agora insira o novo documento com UUID
  await posts.insertOne(post);

  count++;
  console.log(`Migrado post: ${post.titulo || newId}`);
}

    console.log(`Migração concluída! Total migrado: ${count}`);
  } catch (err) {
    console.error('Erro na migração:', err);
  } finally {
    await client.close();
  }
}

migrate();