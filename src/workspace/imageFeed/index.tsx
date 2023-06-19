import { FC } from "react";
import useImages from "../../hooks/useImages";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import ScrollArea from "../../components/ScrollArea";
import { Masonry, RenderComponentProps } from "masonic";

const Image: FC<
  RenderComponentProps<{
    id: number;
    image: string;
  }>
> = ({ index, data: { id, image }, width }) => {
  return (
    <div className="rounded-md overflow-hidden">
      <img
        src={convertFileSrc(image)}
        className="hover:scale-105 transition-transform cursor-pointer"
      />
    </div>
  );
};

const ImageFeed: FC<{ className: string }> = ({ className }) => {
  const images = useImages();

  if (images.length === 0)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p className="text-neutral-500">Cannot locate any images</p>
      </div>
    );

  return (
    <ScrollArea>
      <Masonry
        // TODO: use a better key
        items={images.map((image, index) => ({
          id: index,
          image,
        }))}
        render={Image}
        // Grid cell spacing
        columnGutter={8}
        // Column min width
        columnWidth={300}
        // Pre-renders 5 windows worth of content
        overscanBy={10}
      />
    </ScrollArea>
  );
};

export default ImageFeed;
