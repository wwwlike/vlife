/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */


package cn.wwwlike.vlife.utils;

import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.net.URL;
import java.nio.channels.FileChannel;
import java.nio.file.*;
import java.util.stream.Collectors;

public class FileUtil {
    private static final String DEFAULT_CHARSET = "UTF-8";

    public FileUtil() {
    }

    public static boolean mkdir(String path) {
        if (StringUtils.isEmpty(path)) {
            throw new NullPointerException("dir path can't null or empty");
        } else {
            File file = new File(path);
            return !file.exists() && file.mkdir();
        }
    }

    public static boolean mkdirs(String path) {
        if (StringUtils.isEmpty(path)) {
            throw new NullPointerException("dir path can't null or empty");
        } else {
            File file = new File(path);
            return !file.exists() && file.mkdirs();
        }
    }

    public static void copyDir(String path, String copyPath) {
        File filePath = new File(path);
        if (filePath.isDirectory()) {
            File[] list = filePath.listFiles();

            for (int i = 0; i < list.length; ++i) {
                String newPath = path + File.separator + list[i].getName();
                String newCopyPath = copyPath + File.separator + list[i].getName();
                File newFile = new File(copyPath);
                if (!newFile.exists()) {
                    newFile.mkdir();
                }

                nioTransferCopy(new File(newPath), new File(newCopyPath));
            }

        } else {
            throw new IllegalArgumentException(String.format("%s is not a directory", filePath.getAbsolutePath()));
        }
    }

    public static void nioTransferCopy(File source, File target) {
        FileChannel in = null;
        FileChannel out = null;
        FileInputStream inStream = null;
        FileOutputStream outStream = null;

        try {
            inStream = new FileInputStream(source);
            outStream = new FileOutputStream(target);
            in = inStream.getChannel();
            out = outStream.getChannel();
            in.transferTo(0L, in.size(), out);
        } catch (IOException var15) {
            var15.printStackTrace();
        } finally {
            try {
                if (null != inStream) {
                    inStream.close();
                }

                if (null != in) {
                    in.close();
                }

                if (null != outStream) {
                    outStream.close();
                }

                if (null != out) {
                    out.close();
                }
            } catch (IOException var14) {
                var14.printStackTrace();
            }

        }

    }

    public static byte[] copyToByteArray(InputStream inStream) throws IOException {
        ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
        byte[] buff = new byte[100];

        int rc;
        while ((rc = inStream.read(buff, 0, 100)) > 0) {
            swapStream.write(buff, 0, rc);
        }

        return swapStream.toByteArray();
    }

    public static boolean writeFile(String source, String filePath, boolean append) {
        return writeFile(source, filePath, append, "UTF-8");
    }

    public static boolean writeFileNotAppend(String source, String filePath) {
        return writeFile(source, filePath, false, "UTF-8");
    }

    public static boolean writeFile(String source, String filePath, boolean append, String encoding) {
        OutputStreamWriter osw = null;

        boolean flag;
        try {
            osw = new OutputStreamWriter(new FileOutputStream(filePath, append), encoding);
            osw.write(source);
            flag = true;
        } catch (IOException var15) {
            var15.printStackTrace();
            flag = false;
        } finally {
            try {
                osw.close();
            } catch (IOException var14) {
                var14.printStackTrace();
            }

        }

        return flag;
    }

    public static boolean writeFile(String source, File file, boolean append) {
        BufferedWriter output = null;

        boolean flag;
        try {
            file.createNewFile();
            output = new BufferedWriter(new FileWriter(file, append));
            output.write(source);
            flag = true;
        } catch (IOException var14) {
            var14.printStackTrace();
            flag = false;
        } finally {
            try {
                if (null != output) {
                    output.close();
                }
            } catch (IOException var13) {
                var13.printStackTrace();
            }

        }

        return flag;
    }

    public static String getFileContent(String fileName) {
        try {
            InputStream inputStream = new FileInputStream(fileName);
            return getFileContent((InputStream) inputStream);
        } catch (FileNotFoundException var3) {
            var3.printStackTrace();
            return null;
        }
    }

    // 生成文件夹
    public static void createDir(String path) {
        //  匹配 linux
        if (!System.getProperty("os.name").toLowerCase().contains("win") &&
                !path.startsWith("/")) {
            path = "/" + path;
        }
        File folder = new File(path);
        if (!folder.exists() && !folder.isDirectory()) {
            folder.setWritable(true, false);
            folder.mkdirs();
        } else {
        }
    }

    public static String getFileContent(InputStream inputStream) {
        BufferedReader reader = null;

        try {
            reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
            String var2 = (String) reader.lines().collect(Collectors.joining("\n"));
            return var2;
        } catch (UnsupportedEncodingException var12) {
            var12.printStackTrace();
        } finally {
            try {
                if (reader != null) {
                    reader.close();
                }
            } catch (IOException var11) {
                var11.printStackTrace();
            }

        }

        return null;
    }

    public static File[] getResourceFolderFiles(String folder) {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        URL url = loader.getResource(folder);
        if (null == url) {
            throw new RuntimeException("url is null");
        } else {
            String path = url.getPath();
            return (new File(path)).listFiles();
        }
    }

    public static boolean nioWriteFile(String contents, String filePath) {
        return nioWriteFile(filePath, contents, (OpenOption) null);
    }

    public static boolean nioWriteAppendable(String contents, String filePath) {
        return nioWriteFile(filePath, contents, StandardOpenOption.APPEND);
    }

    private static boolean nioWriteFile(String filePath, String contents, OpenOption openOption) {
        Path path = Paths.get(filePath);

        try {
            Files.createDirectories(path.getParent());
            if (!Files.exists(path, new LinkOption[0])) {
                Files.createFile(path);
            }

            if (null == openOption) {
                Files.write(path, contents.getBytes("UTF-8"), new OpenOption[0]);
            } else {
                Files.write(path, contents.getBytes("UTF-8"), new OpenOption[]{openOption});
            }

            return true;
        } catch (IOException var5) {
            var5.printStackTrace();
            return false;
        }
    }

    public static String toSuffix(String fileName) {
        String name = null;

        try {
            int index = fileName.lastIndexOf(".");
            name = fileName.substring(0, index);
        } catch (Exception var3) {
            var3.printStackTrace();
        }

        return name;
    }


    public static boolean copyInputStreamToFile(InputStream source, File destination, StandardCopyOption copyOption) {
        boolean flag = true;

        try {
            Files.copy(source, destination.toPath(), new CopyOption[]{copyOption});
        } catch (IOException var13) {
            var13.printStackTrace();
            flag = false;
        } finally {
            try {
                if (source != null) {
                    source.close();
                }
            } catch (IOException var12) {
                var12.printStackTrace();
                flag = false;
            }

        }

        return flag;
    }

}
