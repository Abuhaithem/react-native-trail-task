import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#0288d1',
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  separator: {
    height: 8,
  },
  header: {
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0288d1',
  },
  searchInput: {
    marginTop: 12,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  footer: {
    height: 24,
  },
});
