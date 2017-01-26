using System;
using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

using Microsoft.ProjectOxford.Emotion;
using Microsoft.ProjectOxford.Emotion.Contract;
using Java.IO;
using Android.Graphics;
using Android.Provider;
using Android.Content.PM;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace MVAIoTMobile
{
    public static class App
    {
        public static File _file { get; set; }
        public static File _dir { get; set; }
        public static Bitmap bitmap { get; set; }

        public static string API_KEY = "44fd571be5154f748e7df25de57cffbe";
        public static EmotionServiceClient _emotionServiceClient;
        public static Emotion[] _emotionResult;

        public static string IOT_API = "http://mvaiot2backend.azurewebsites.net/api/Insight/Create/1000/hola";
    }

    public static class BitmapHelpers
    {
        public static Bitmap LoadAndResizeBitmap(this string fileName, int width, int height)
        {
            BitmapFactory.Options options = new BitmapFactory.Options { InJustDecodeBounds = true };
            BitmapFactory.DecodeFile(fileName, options);

            int outHeight = options.OutHeight;
            int outWidth = options.OutWidth;

            int inSampleSize = 1;

            if(outHeight > height || outWidth > width)
            {
                inSampleSize = outWidth > outHeight
                                ? outHeight / height
                                : outWidth / width;
            }

            options.InSampleSize = inSampleSize;
            options.InJustDecodeBounds = false;
            Bitmap resizedBitmap = BitmapFactory.DecodeFile(fileName, options);

            return resizedBitmap;
        }

        public static System.IO.Stream LoadStreamFromFile(this string fileName)
        {
            System.IO.Stream fs = new System.IO.FileStream(fileName, System.IO.FileMode.OpenOrCreate, System.IO.FileAccess.Read);
            return fs;
        }
    }

    [Activity(Label = "MVAIoTMobile", MainLauncher = true, Icon = "@drawable/icon")]
    public class MainActivity : Activity
    {
        ImageView _imageView;
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            CreateDirectoryForPictures();

            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.Main);

            Button cameraButton = FindViewById<Button>(Resource.Id.TakePhoto);
            _imageView = FindViewById<ImageView>(Resource.Id.imageView);

            App._emotionServiceClient = new EmotionServiceClient(App.API_KEY);

            cameraButton.Click += CameraButton_Click;
        }

        private void CameraButton_Click(object sender, EventArgs e)
        {
            Intent intent = new Intent(MediaStore.ActionImageCapture);
            App._file = new File(App._dir, String.Format("cognitive_services_{0}.jpg", Guid.NewGuid()));

            intent.PutExtra(MediaStore.ExtraOutput, Android.Net.Uri.FromFile(App._file));

            StartActivityForResult(intent, 0);
        }

        private void CreateDirectoryForPictures()
        {
            App._dir = new File(
                Android.OS.Environment.GetExternalStoragePublicDirectory(
                        Android.OS.Environment.DirectoryPictures
                    ), "MVAIoT2"
                );

            if (!App._dir.Exists())
            {
                App._dir.Mkdirs();
            }
        }

        private bool IsThereAnAppToTakePictures()
        {
            Intent intent = new Intent(MediaStore.ActionImageCapture);
            IList<ResolveInfo> availableActivities = PackageManager.QueryIntentActivities(intent, PackageInfoFlags.MatchDefaultOnly);

            return availableActivities != null && availableActivities.Count > 0;
        }

        protected override async void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            Intent mediaScanIntent = new Intent(Intent.ActionMediaScannerScanFile);
            Android.Net.Uri contentUri = Android.Net.Uri.FromFile(App._file);
            mediaScanIntent.SetData(contentUri);
            SendBroadcast(mediaScanIntent);

            int height = Resources.DisplayMetrics.HeightPixels;
            int width = _imageView.Height;
            App.bitmap = App._file.Path.LoadAndResizeBitmap(width, height);

            if(App.bitmap != null)
            {
                _imageView.SetImageBitmap(App.bitmap);
                App.bitmap = null;

                /// Cognitive Services
                try
                {
                    var stream = App._file.Path.LoadStreamFromFile();
                    App._emotionResult = await App._emotionServiceClient.RecognizeAsync(stream);

                    if(App._emotionResult != null)
                    {
                        if((App._emotionResult[0].Scores.Happiness * 100) > 60)
                        {
                            await SetExpressionAsync();
                        }
                    }
                }
                catch (Exception ex)
                {
                    
                }

                GC.Collect();
            }
        }

        private async Task<bool> SetExpressionAsync()
        {
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(App.IOT_API));
            request.ContentType = "application/json";
            request.Method = "GET";

            using (WebResponse response = await request.GetResponseAsync())
            {
                using (System.IO.Stream stream = response.GetResponseStream())
                {
                    // TODO
                    return true;
                }
            }

        }
    }
}

