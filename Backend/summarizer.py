from flask import Flask, request, jsonify
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.stem import PorterStemmer
import string
from collections import defaultdict

app = Flask(__name__)

# make sure both tokenizers are installed
nltk.download('punkt')      # your sentence tokenizer
nltk.download('stopwords')
nltk.download('punkt_tab')  # the one Flask just complained about

class ScratchSummarizer:
    def __init__(self):
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))

    def preprocess_text(self, text):
        sentences = sent_tokenize(text)
        processed_sentences = []
        for sentence in sentences:
            words = word_tokenize(sentence)
            words = [w.lower() for w in words if w not in string.punctuation]
            words = [self.stemmer.stem(w) for w in words if w not in self.stop_words]
            processed_sentences.append(words)
        return sentences, processed_sentences

    def calculate_sentence_scores(self, processed_sentences):
        word_counts = defaultdict(int)
        for sentence in processed_sentences:
            for word in sentence:
                word_counts[word] += 1

        tf_scores, pos_scores, kw_scores = [], [], []
        total = len(processed_sentences)
        for i, sentence in enumerate(processed_sentences):
            tf = sum(word_counts[word] for word in sentence)
            tf_scores.append(tf / len(sentence) if sentence else 0)
            pos_scores.append(1 - (i / total))

        # top 20% keywords
        keywords = set()
        if word_counts:
            top_n = max(1, int(len(word_counts) * 0.2))
            keywords = set(word for word, _ in sorted(word_counts.items(), key=lambda x: x[1], reverse=True)[:top_n])

        for sentence in processed_sentences:
            kw_scores.append(sum(1 for w in sentence if w in keywords))

        # combined weighted score
        return [0.5 * tf + 0.3 * pos + 0.2 * kw
                for tf, pos, kw in zip(tf_scores, pos_scores, kw_scores)]

    def summarize(self, text, num_sentences=3):
        if not text.strip():
            return {"error": "No text to summarize"}

        original, processed = self.preprocess_text(text)
        if len(original) <= num_sentences:
            return {"summary": text}

        scores = self.calculate_sentence_scores(processed)
        # pick top indices
        idxs = sorted(sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:num_sentences])
        summary = ' '.join(original[i] for i in idxs)
        return {"summary": summary}

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json() or {}
    text = data.get('text', '')
    num = int(data.get('num_sentences', 3))
    result = ScratchSummarizer().summarize(text, num)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)