export const getImageUrl = (path: string | undefined | null) => {
    if (!path) return 'https://via.placeholder.com/800x600?text=No+Image';
    if (path.startsWith('http')) return path;
    
    // If path already starts with /uploads, just append it to base
    // If not, and it doesn't start with http, assume it needs /uploads prefix? 
    // Actually DB results showed /uploads/... so we just need to append to domain.
    
    // Clean path to ensure no double slashes at start
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Ensure we don't double up if the path is something like "file.jpg" vs "uploads/file.jpg"
    // But for now, let's stick to simple appending since DB has full path.
    return `http://localhost:8000/${cleanPath}`;
};
