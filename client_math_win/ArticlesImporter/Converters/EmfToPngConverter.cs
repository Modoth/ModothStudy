using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesImporter.Converters
{
    public class EmfToPngConverter
    {
        public void Convert(string fIn, string fOut)
        {
            using (Metafile mf = new Metafile(fIn))

            {
                var bitmap = new Bitmap(mf.Width, mf.Height);
                using (Graphics g = Graphics.FromImage(bitmap))
                {
                    g.DrawImage(mf, 0,0, mf.Width, mf.Height);

                    g.Save();
                    bitmap.Save(fOut, ImageFormat.Png);
                }

            }
        }
    }
}
