
import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    coverImage: { type: String, required: true, default: 'https://picsum.photos/200/300' },
    year: { type: Number, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.statics.seedBooks = async function () {
  try {
    const count = await this.countDocuments();
    if (count === 0) {
      console.log('Database empty. Seeding default books from OpenLibrary API...');
      const response = await fetch('https://openlibrary.org/search.json?q=programming+computer+science&limit=10');
      const data = await response.json();

      const booksToSeed = data.docs.map(doc => ({
        title: doc.title ? doc.title.substring(0, 100) : 'Unknown Title',
        author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
        genre: doc.subject ? doc.subject[0] : 'Programming',
        coverImage: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : `https://picsum.photos/seed/${encodeURIComponent(doc.title)}/400/600`,
        year: doc.first_publish_year || new Date().getFullYear(),
        description: doc.first_sentence ? (typeof doc.first_sentence === 'string' ? doc.first_sentence : doc.first_sentence[0]) : `An excellent book about ${doc.title}.`
      }));

      await this.insertMany(booksToSeed);
      console.log(`Successfully seeded ${booksToSeed.length} books.`);
    }
  } catch (error) {
    console.error('Error seeding books:', error.message);
  }
};

const Book = mongoose.model('Book', bookSchema);

export default Book;
