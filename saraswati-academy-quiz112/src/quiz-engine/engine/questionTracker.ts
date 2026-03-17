export class QuestionTracker {
  private readonly MAX_HISTORY = 1000;
  private readonly STORAGE_PREFIX = "saraswati_asked_questions";
  private cache: Record<string, string[]> = {};

  private getKey(genre: string, difficulty: string): string {
    return `${this.STORAGE_PREFIX}_${genre}_${difficulty}`;
  }

  public getAskedIds(genre: string, difficulty: string): string[] {
    const key = this.getKey(genre, difficulty);
    if (this.cache[key]) {
      return this.cache[key];
    }
    try {
      const stored = localStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : [];
      this.cache[key] = parsed;
      return parsed;
    } catch (e) {
      return [];
    }
  }

  public add(id: string, genre: string, difficulty: string): void {
    const key = this.getKey(genre, difficulty);
    const askedIds = this.getAskedIds(genre, difficulty);
    if (!askedIds.includes(id)) {
      askedIds.push(id);
      if (askedIds.length > this.MAX_HISTORY) {
        askedIds.shift();
      }
      this.cache[key] = askedIds;
      try {
        localStorage.setItem(key, JSON.stringify(askedIds));
      } catch (e) {
        console.error("Failed to save asked questions", e);
      }
    }
  }

  public addMultiple(ids: string[], genre: string, difficulty: string): void {
    const key = this.getKey(genre, difficulty);
    const askedIds = this.getAskedIds(genre, difficulty);
    const newIds = ids.filter(id => !askedIds.includes(id));
    if (newIds.length > 0) {
      const updatedAsked = [...askedIds, ...newIds];
      if (updatedAsked.length > this.MAX_HISTORY) {
        updatedAsked.splice(0, updatedAsked.length - this.MAX_HISTORY);
      }
      this.cache[key] = updatedAsked;
      try {
        localStorage.setItem(key, JSON.stringify(updatedAsked));
      } catch (e) {
        console.error("Failed to save asked questions", e);
      }
    }
  }

  public has(id: string, genre: string, difficulty: string): boolean {
    const askedIds = this.getAskedIds(genre, difficulty);
    return askedIds.includes(id);
  }

  public clear(genre: string, difficulty: string): void {
    const key = this.getKey(genre, difficulty);
    this.cache[key] = [];
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Failed to clear asked questions", e);
    }
  }
}

export const questionTracker = new QuestionTracker();
