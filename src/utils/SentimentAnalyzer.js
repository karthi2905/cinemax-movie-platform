class SentimentAnalyzer {
  constructor() {
    this.positiveWords = [
      'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'incredible', 'outstanding',
      'perfect', 'wonderful', 'brilliant', 'superb', 'magnificent', 'spectacular', 'phenomenal',
      'terrific', 'marvelous', 'exceptional', 'impressive', 'remarkable', 'stunning', 'beautiful',
      'love', 'adore', 'enjoy', 'like', 'recommend', 'best', 'favorite', 'good', 'nice', 'cool',
      'fun', 'entertaining', 'engaging', 'compelling', 'captivating', 'thrilling', 'exciting'
    ];

    this.negativeWords = [
      'awful', 'terrible', 'horrible', 'bad', 'worst', 'hate', 'disgusting', 'annoying',
      'boring', 'dull', 'stupid', 'ridiculous', 'disappointing', 'pathetic', 'useless',
      'worthless', 'garbage', 'trash', 'waste', 'poor', 'lacking', 'weak', 'failed',
      'disaster', 'mess', 'confusing', 'complicated', 'slow', 'tedious', 'uninspired',
      'cliché', 'predictable', 'generic', 'mediocre', 'forgettable', 'bland', 'flat'
    ];

    this.intensifiers = [
      'very', 'extremely', 'incredibly', 'really', 'quite', 'absolutely', 'completely',
      'totally', 'utterly', 'highly', 'exceptionally', 'remarkably', 'particularly',
      'especially', 'significantly', 'tremendously', 'enormously', 'immensely'
    ];

    this.negators = [
      'not', 'no', 'never', 'nothing', 'nobody', 'none', 'neither', 'nowhere',
      'hardly', 'barely', 'scarcely', 'seldom', 'rarely', 'without', 'lack', 'missing'
    ];
  }

  analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
      return {
        sentiment: 'neutral',
        score: 0,
        confidence: 0,
        details: {
          analysis: {
            positiveWords: [],
            negativeWords: [],
            intensifiers: [],
            negators: []
          }
        }
      };
    }

    const words = this.preprocessText(text);
    const analysis = this.analyzeWords(words);
    const score = this.calculateSentimentScore(analysis, words);
    const sentiment = this.classifySentiment(score);
    const confidence = this.calculateConfidence(analysis, words);

    return {
      sentiment,
      score,
      confidence,
      details: {
        wordCount: words.length,
        analysis
      }
    };
  }

  preprocessText(text) {
    // Convert to lowercase and split into words
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 1); // Remove single character words
  }

  analyzeWords(words) {
    const analysis = {
      positiveWords: [],
      negativeWords: [],
      intensifiers: [],
      negators: []
    };

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      if (this.positiveWords.includes(word)) {
        analysis.positiveWords.push(word);
      }
      
      if (this.negativeWords.includes(word)) {
        analysis.negativeWords.push(word);
      }
      
      if (this.intensifiers.includes(word)) {
        analysis.intensifiers.push(word);
      }
      
      if (this.negators.includes(word)) {
        analysis.negators.push(word);
      }
    }

    return analysis;
  }

  calculateSentimentScore(analysis, words) {
    let score = 0;
    
    // Basic sentiment score
    score += analysis.positiveWords.length * 1;
    score -= analysis.negativeWords.length * 1;
    
    // Apply intensifier multiplier
    const intensifierMultiplier = 1 + (analysis.intensifiers.length * 0.3);
    score *= intensifierMultiplier;
    
    // Apply negator effect (flip sentiment if negators present)
    if (analysis.negators.length > 0) {
      score *= -0.8;
    }
    
    // Normalize by text length
    if (words.length > 0) {
      score = score / Math.sqrt(words.length);
    }
    
    // Clamp between -1 and 1
    return Math.max(-1, Math.min(1, score));
  }

  classifySentiment(score) {
    if (score > 0.1) return 'positive';
    if (score < -0.1) return 'negative';
    return 'neutral';
  }

  calculateConfidence(analysis, words) {
    const totalSentimentWords = analysis.positiveWords.length + analysis.negativeWords.length;
    
    if (words.length === 0) return 0;
    
    // Confidence based on ratio of sentiment words to total words
    let confidence = totalSentimentWords / words.length;
    
    // Boost confidence if intensifiers are present
    if (analysis.intensifiers.length > 0) {
      confidence *= 1.2;
    }
    
    // Reduce confidence if text is very short
    if (words.length < 5) {
      confidence *= 0.7;
    }
    
    // Reduce confidence if both positive and negative words are present
    if (analysis.positiveWords.length > 0 && analysis.negativeWords.length > 0) {
      confidence *= 0.8;
    }
    
    return Math.max(0, Math.min(1, confidence));
  }

  // Batch analyze multiple texts
  analyzeBatch(texts) {
    return texts.map(text => this.analyzeSentiment(text));
  }

  // Get sentiment statistics for a collection of texts
  getSentimentStats(texts) {
    const analyses = this.analyzeBatch(texts);
    
    const positive = analyses.filter(a => a.sentiment === 'positive').length;
    const negative = analyses.filter(a => a.sentiment === 'negative').length;
    const neutral = analyses.filter(a => a.sentiment === 'neutral').length;
    
    const averageScore = analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;
    const averageConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;
    
    return {
      total: analyses.length,
      distribution: {
        positive: (positive / analyses.length) * 100,
        negative: (negative / analyses.length) * 100,
        neutral: (neutral / analyses.length) * 100
      },
      averageScore,
      averageConfidence,
      analyses
    };
  }

  // Extract most common positive and negative words from a collection
  extractKeyWords(texts, limit = 10) {
    const allAnalyses = this.analyzeBatch(texts);
    
    const positiveWordCounts = {};
    const negativeWordCounts = {};
    
    allAnalyses.forEach(analysis => {
      analysis.details.analysis.positiveWords.forEach(word => {
        positiveWordCounts[word] = (positiveWordCounts[word] || 0) + 1;
      });
      
      analysis.details.analysis.negativeWords.forEach(word => {
        negativeWordCounts[word] = (negativeWordCounts[word] || 0) + 1;
      });
    });
    
    const sortByCount = (counts) => 
      Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word, count]) => ({ word, count }));
    
    return {
      topPositiveWords: sortByCount(positiveWordCounts),
      topNegativeWords: sortByCount(negativeWordCounts)
    };
  }

  // Generate insights from sentiment analysis
  generateInsights(texts) {
    const stats = this.getSentimentStats(texts);
    const keyWords = this.extractKeyWords(texts);
    
    const insights = [];
    
    // Overall sentiment insight
    if (stats.distribution.positive > 60) {
      insights.push({
        type: 'positive',
        message: `${stats.distribution.positive.toFixed(1)}% of reviews are positive`,
        confidence: 0.9
      });
    } else if (stats.distribution.negative > 40) {
      insights.push({
        type: 'negative',
        message: `${stats.distribution.negative.toFixed(1)}% of reviews express negative sentiment`,
        confidence: 0.85
      });
    }
    
    // Confidence insight
    if (stats.averageConfidence > 0.7) {
      insights.push({
        type: 'volume',
        message: 'Reviews contain strong sentiment indicators',
        confidence: stats.averageConfidence
      });
    }
    
    // Mixed sentiment insight
    if (stats.distribution.positive > 30 && stats.distribution.negative > 30) {
      insights.push({
        type: 'mixed',
        message: 'Reviews show polarized opinions',
        confidence: 0.8
      });
    }
    
    return {
      stats,
      keyWords,
      insights
    };
  }
}

export default SentimentAnalyzer;
