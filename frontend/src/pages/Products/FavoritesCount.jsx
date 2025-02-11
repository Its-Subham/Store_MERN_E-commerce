import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="absolute left-2 top-8">
      {favoriteCount > 0 && (
        <span className="w-5 h-5 flex items-center justify-center text-sm text-white bg-pink-500 rounded-full shadow-lg">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;