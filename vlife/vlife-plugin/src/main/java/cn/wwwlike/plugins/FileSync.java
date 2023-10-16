package cn.wwwlike.plugins;

import java.io.File;
import java.io.IOException;
import java.util.Set;

import com.google.common.collect.Sets;
import com.google.common.io.Files;
import org.apache.commons.io.FileUtils;


public class FileSync {
    public static void syncFiles(File source, File target) throws IOException {
        Set<String> sourceFiles = Sets.newHashSet(source.list());
        Set<String> targetFiles = Sets.newHashSet(target.list());
        // remove files from target that are not in source
        for (String targetFile : targetFiles) {
            if (!sourceFiles.contains(targetFile)) {
                deleteFile(new File(target, targetFile));
            }
        }
        for (String sourceFile : sourceFiles) {
            File file = new File(source, sourceFile);
            File file2 = new File(target, sourceFile);
            if (file.isFile()) {
                copyIfChanged(file, file2);
            } else {
                file2.mkdir();
                syncFiles(file, file2);
            }
        }
    }

    private static void copyIfChanged(File source, File target) throws IOException {
        if (target.exists()) {
            if (source.length() == target.length() && FileUtils.checksumCRC32(source) == FileUtils.checksumCRC32(target)) {
                return;
            } else {
                target.delete();
            }
        }
        if (!source.renameTo(target)) {
            Files.move(source, target);
        }
    }

    private static void deleteFile(File file) throws IOException {
        if (file.isDirectory()) {
            FileUtils.deleteDirectory(file);
        } else {
            file.delete();
        }
    }
    private FileSync() {}
}

