#!/usr/bin/perl 
#===============================================================================
#
#         FILE:  txt2tex.pl
#
#        USAGE:  ./txt2tex.pl <infile>[.txt]
#
#  DESCRIPTION:  Generates XeLaTeX code for the "Mechanical Translation of the Torah"
#
#      OPTIONS:  tweaks.txt (tweaked lengths for tokens) and <infile>.fnt (footnotes)
# REQUIREMENTS:  An plain-text infile with one verse per line of alternating English
#                and Hebrew tokens (words)
#
#         BUGS:  ---
#        NOTES:  Output is saved to <infile>.tex
#
#       AUTHOR:  Gregory Bartholomew
#      COMPANY:  
#      VERSION:  1.0
#      CREATED:  06/06/2011 10:52:22 AM
#     REVISION:  ---
#===============================================================================

use strict;
use warnings;

use POSIX ('ceil');
use open (':std', ':encoding(utf8)');

die unless (defined $ARGV[0] && -e $ARGV[0] && $ARGV[0] =~ /^(.*?)(?:\.txt)?$/);

my $IFILE;
my $OFILE;

my $ifile = $1 . '.txt'; # input file
my $ofile = $1 . '.tex'; # output file
# my $ffile = $1 . '.fnt'; # footnotes file

my $book = lc($1);

# lengths
my $lpp = 11; # lines per page
my $linelength = 575; # pts per line (1 pt = 1/72 inch)
my $tablesep = 2; # the width in pts of the whitespace between the tables (verses) on any given line
my $ptperchar = 4.2; # the average width of a character in pts
my $vptperchar = 4.3; # the average width of a character in pts for verse-boxes
my $minwidth = 6; # the minimum width of a box (table-cell)
my $rulewidth = 0.05; # the thickness of the table lines

# vertical offsets of text
my $svoffset = 1; # semitic text vertical offset
my $pvoffset = 2; # semitic text vertical offset
my $hvoffset = -2; # hebrew text vertical offset
my $evoffset = -3.75; # english text vertical offset
my $vvoffset = 29; # verse text vertical offset
my $ivoffset = -3.5; # strong's text vertical offset

# vertical offsets of horizontal lines
my $sline = 3.5; # top line
my $pline = 3.25; # top line
my $tline = 3.25; # top line
my $cline = -2; # center line
my $bline = -1.5; # bottom line
my $iline = -1.5; # bottom line

my $fncpl = 450; # number of foot note characters per line (for every fncpl, lpp will be reduced by one)

# tex code to be prefixed to each section (book)
my $preamble = << "END";
\\phantomsection\\label{page:${book}}
END

# tex code to be suffixed to each section (book)
my $postamble = << "END";
END

my %syllable = (
   0x05D0 => "Ah",
   0x05D1 => "Bo",
   0x05D2 => "Ge",
   0x05D3 => "Du",
   0x05D4 => "He",
   0x05D5 => "Wu",
   0x05D6 => "Za",
   0x05D7 => "{\\char\"1E24}o", # "Ḥo",
   0x05D8 => "Thu",
   0x05D9 => "Ye",
   0x05DA => "Ke",
   0x05DB => "Ke",
   0x05DC => "Lu",
   0x05DD => "Mo",
   0x05DE => "Mo",
   0x05DF => "Na",
   0x05E0 => "Na",
   0x05E1 => "Sa",
   0x05E2 => "{\\char\"0295}", # "ʿ",
   0x05E3 => "Po",
   0x05E4 => "Po",
   0x05E5 => "Tse",
   0x05E6 => "Tse",
   0x05E7 => "Ku",
   0x05E8 => "Re",
   0x05E9 => "Shu",
   0x05EA => "To",
   0x05EB => "Ga",
   0x05EC => "Zo"
);

my %tweak;
if (-e 'tweaks.txt') {
   open(TFILE, '<', 'tweaks.txt');

   foreach (<TFILE>) {
      if (/^(\S+) ([[:digit:]]+(?:\.[[:digit:]]+)?)$/) {
         $tweak{$1} = $2;
      }
   }

   close(TFILE);
}

my %strongs;
if (-e 'strongs.txt') {
   open(SFILE, '<', 'strongs.txt');

   foreach (<SFILE>) {
      if (/^(\S+) (several|[[:digit:]]+(?: [[:digit:]]+)?)$/) {
         $strongs{$1} = $2;
      }
   }
}

# my %footnote;
# if (-e $ffile) {
#    open(FFILE, '<', $ffile);
# 
#    foreach (<FFILE>) {
#       if (/^(\d+:\d+:\d+) (.*)$/) {
#          $footnote{$1} = $2;
#       }
#    }
# 
#    close(FFILE);
# }

sub VerseFilter($) {
   my $_ = shift();

   if (defined $_) {
      s/^(.*)$/{\\T \\small\\textbf{\\textcolor{maroon}{$1}}}/;
   }

   return $_;
}

sub SemiticFilter($) {
   my $_ = shift();

   if (defined $_) {
      s/^(.*)$/{\\S $1}/;
   }

   return $_;
}

sub VocalizationFilter($) {
   my $_ = shift();

   if (defined $_) {
      s/^(.*)$/{\\V $1}/;
   }

   return $_;
}

sub HebrewFilter($) {
   my $_ = shift();

   if (defined $_) {
      s/^(.*)$/{\\H $1}/;
   }

   return $_;
}

sub EnglishFilter($) {
   my $_ = shift();

   if (defined $_) {
      s/\^/{\\char`\\^}/g;
      s/\[X\]/{[}X{]}/g;
      s/\&/\\\&/g;
      s/~/\\textasciitilde{}/g;
   }

   return $_;
}

sub StrongsFilter($) {
   my $_ = shift();

   if (defined $_) {
      $_ = $strongs{$_} || '?';
      s/^(.*)$/{\\I $1}/;
   }

   return $_;
}

sub Max($ $);
sub NewTable();
sub NewLine();
sub NewPage();
sub SavePage($); # saves a page to the output file

my $plv = '1:1';

MAIN: {
   open($IFILE, '<', $ifile);
   open($OFILE, '>', $ofile);

   select $OFILE;

   my $table = NewTable();
   my $line = NewLine();
   my $page = NewPage();
   
   my $usedlength = 0;
   my $thislength = 0;
   
   while(<$IFILE>) {
      my @buffer = split();
   
      my @verseparts = ();
      my $currentverse = '';
      while ($buffer[0] && $buffer[0] =~ /(\d+:\d+)/) {
         $currentverse = $1 if ($#verseparts == -1);
         unshift @verseparts, shift @buffer;
      }
      my $versetext = join(' ', @verseparts);
      $versetext =~ s/[^\p{BLOCK: ASCII}]//g;
      unshift @buffer, ('', $versetext);
   
      if ($currentverse) {
         my $column = undef();
         for (my $i = 0; $i < $#buffer/2; $i++) {
            $thislength = ($ptperchar)*(length($buffer[$i*2+1]));
   
            if ($usedlength + $thislength >= $linelength) {
               # don't allow the last column of a line to be a verse heading
               if (defined $column && $column->{'isverse'} == 1) {
                  $table->{'RemoveColumn'}->($column);
                  $usedlength -= $column->{'length'};
                  $i--;
               }

               $line->{'AddTable'}->($table);
               $table = NewTable();

               $page->{'AddLine'}->($line);
               $line = NewLine();

               if (($#{$page->{'lines'}}+1) > ($lpp - ceil($page->{'fnc'}/$fncpl))) {
                  SavePage($page);
                  $page = NewPage();
               }

               $usedlength = 0;
            }
  
            $column = {
               'isverse'=>($i) ? 0 : 1,
               'alignment'=>($i) ? 'c' : 'r',
               'semitic'=>pack("U*", grep { $_ >= 0x05D0 && $_ <= 0x05EC } unpack("U*", $buffer[$i*2])),
               'vocalization'=>join('\'', map { $syllable{$_} } grep { $_ >= 0x05D0 && $_ <= 0x05EC } unpack("U*", $buffer[$i*2])),
               'hebrew'=>$buffer[$i*2],
               'english'=>$buffer[$i*2+1],
               'strongs'=>shift [ grep { /^[[:upper:]][[:alpha:]]/ } split(/~/, $buffer[$i*2+1]) ]
            };

            if (exists $tweak{$buffer[$i*2+1]}) {
               $column->{'length'} = $tweak{$buffer[$i*2+1]};
            } elsif ($column->{'isverse'}) {
               $column->{'length'} = $vptperchar*length($buffer[$i*2+1]) + 5;
            } else {
               $column->{'length'} = ($ptperchar)*(Max(length($buffer[$i*2+1]), $minwidth));
            }
   
            # my $address = $currentverse . ':' . $i;
            # if (exists $footnote{$address}) {
            #    $column->{'footnote'} = $footnote{$address};
            # }
   
            $table->{'AddColumn'}->($column);
            $usedlength += $column->{'length'};
         }
         $line->{'AddTable'}->($table);
         $table = NewTable();
      }
   }
   $page->{'AddLine'}->($line);
   SavePage($page);

   print $postamble, "\n";
   
   close($OFILE);
   close($IFILE);
}

sub Max($ $) {
   my ($a, $b) = @_;
   return ($a > $b) ? $a : $b;
}

sub NewTable() {
   my $table;
   return $table = {
      'length'=>0,
      'columns'=>[],
      'hasverse'=>0,
      'fnc'=>0,
   
      'AddColumn'=>sub($) {
         my $column = shift();
   
         if (defined $column) {
            push @{$table->{'columns'}}, $column;
            $table->{'length'} += $column->{'length'};
            $table->{'fnc'} += length($column->{'footnote'}) if (exists $column->{'footnote'});
            $table->{'hasverse'} = 1 if ($column->{'isverse'});
         }
      },
   
      'RemoveColumn'=>sub($) {
         my $column = shift();
   
         if (defined $column) {
            $table->{'columns'} = [ grep { not $_ == $column } @{$table->{'columns'}} ];
            $table->{'length'} -= $column->{'length'};
            $table->{'fnc'} -= length($column->{'footnote'}) if (exists $column->{'footnote'});
            $table->{'hasverse'} = 0 if ($column->{'isverse'});
         }
      }
   }
}

sub NewLine() {
   my $line;
   return $line = {
      'length'=>0,
      'tables'=>[],
      'verses'=>[],
      'fnc'=>0,

      'AddTable'=>sub($) {
         my $table = shift();
   
         if (defined $table && $#{$table->{'columns'}} >= 0) {
            push @{$line->{'tables'}}, $table;
            $line->{'length'} += $table->{'length'};
            $line->{'fnc'} += $table->{'fnc'};
            if ($table->{'hasverse'}) {
               push @{$line->{'verses'}}, $#{$line->{'tables'}};
            }
         }
      }
   }
}

sub NewPage() {
   my $page;
   return $page = {
      'lines'=>[],
      'firstverse'=>undef(),
      'lastverse'=>$plv,
      'fnc'=>0,

      'AddLine'=>sub($) {
         my $line = shift();
   
         if (defined $line && $#{$line->{'tables'}} >= 0) {
            $line->{'length'} += $#{$line->{'tables'}}*$tablesep;
            push @{$page->{'lines'}}, $line;
            $page->{'fnc'} += $line->{'fnc'};
   
            if ($#{$line->{'verses'}} >= 0) {
               my $verses = $line->{'verses'};
   
               if (not defined $page->{'firstverse'}) {
                  $page->{'firstverse'} = $line->{'tables'}->[$verses->[0]]->{'columns'}->[0]->{'english'};
               }
               $page->{'lastverse'} = $line->{'tables'}->[$verses->[$#{$verses}]]->{'columns'}->[0]->{'english'};
            }
         }
      }
   }
}

sub SavePage($) {
   my ($page) = @_;

   $page->{'firstverse'} = $page->{'lastverse'} if (not defined $page->{'firstverse'});

   foreach ($page->{'firstverse'}, $page->{'lastverse'}) {
      if (/ /) {
         $_ = join(' ', reverse split(' '));
      }
   }

   print '\newpage', "\n", '\markright{{\T{}\bfseries{}', ucfirst($book), ' ', $page->{'firstverse'}, ' -- ', $page->{'lastverse'}, '}}', "\n";

   if ($page->{'firstverse'} eq '1:1') {
      print $preamble, "\n";
   }

   if (defined $page && ($#{$page->{'lines'}} >= 0)) {
      # my @f = ();

      foreach my $l (@{$page->{'lines'}}) {
         my @c = ();

         my $tofill = $linelength;
         my $used = $l->{'length'};

         # we don't want to scale the size of the verse-boxes
         foreach (@{$l->{'verses'}}) {
            my $verselength = $l->{'tables'}->[$_]->{'columns'}->[0]->{'length'};

            $tofill -= $verselength;
            $used -= $verselength;
         }

         my $multiplier = ($used/$tofill > 0.65) ? $tofill/$used : 1;

         for (my $i = 0; $i <= $#{$l->{'tables'}}; $i++) {
            my $t = $l->{'tables'}->[$i];

            foreach my $c (@{$t->{'columns'}}) {
               my $length = $c->{'length'};
               # my $footnotes = '';

               $length *= $multiplier if (!$c->{'isverse'});

               # if (exists $c->{'footnote'}) {
               #    push @f, $c->{'footnote'};
               #    $footnotes = '\footnotemark[' . ($#f+1) . ']';
               # }

               push @c, [
                  '\raisebox{0pt}[0pt][0pt]{{\color{gray}\rule[' . $sline . 'pt]{' . $length . 'pt}{' . $rulewidth . 'pt}}}',

                  '\raisebox{' . $svoffset . 'pt}[0pt][0pt]{'
                  .   '\makebox[' . ($length) . 'pt][c]{'
                  .     SemiticFilter($c->{'semitic'}) # . $footnotes
                  .   '}'
                  . '}',

                  '\raisebox{0pt}[0pt][0pt]{{\color{gray}\rule[' . $pline . 'pt]{' . $length . 'pt}{' . (($c->{'isverse'}) ? 0 : $rulewidth) . 'pt}}}',

                  '\raisebox{' . $pvoffset . 'pt}[0pt][0pt]{'
                  .   '\makebox[' . ($length) . 'pt][c]{'
                  .     VocalizationFilter($c->{'vocalization'}) # . $footnotes
                  .   '}'
                  . '}',

                  '\raisebox{0pt}[0pt][0pt]{{\color{gray}\rule[' . $tline . 'pt]{' . $length . 'pt}{' . (($c->{'isverse'}) ? 0 : $rulewidth) . 'pt}}}',

                  '\raisebox{' . $hvoffset . 'pt}[0pt][0pt]{'
                  .   '\makebox[' . ($length) . 'pt][c]{'
                  .     HebrewFilter($c->{'hebrew'}) # . $footnotes
                  .   '}'
                  . '}',

                  '\raisebox{0pt}[0pt][0pt]{{\color{gray}\rule[' . $cline . 'pt]{' . $length . 'pt}{' . (($c->{'isverse'}) ? 0 : $rulewidth) . 'pt}}}',

                  '\raisebox{' . (($c->{'isverse'}) ? $vvoffset : $evoffset) . 'pt}[0pt][0pt]{'
                  .   '\makebox[' . ($length) . 'pt][c]{'
                  .     (($c->{'isverse'}) ? VerseFilter($c->{'english'}) : EnglishFilter($c->{'english'}))
                  .   '}'
                  . '}',

                  '\raisebox{0pt}[0pt][0pt]{{\color{gray}\rule[' . $bline . 'pt]{' . $length . 'pt}{' . (($c->{'isverse'}) ? 0 : $rulewidth) . 'pt}}}',

                  '\raisebox{' . $ivoffset . 'pt}[0pt][0pt]{'
                  .   '\makebox[' . ($length) . 'pt][c]{'
                  .     StrongsFilter($c->{'strongs'})
                  .   '}'
                  . '}',

                  '\raisebox{0pt}[0pt][0pt]{{\color{gray}\rule[' . $iline . 'pt]{' . $length . 'pt}{' . $rulewidth . 'pt}}}'
               ];
            }

            if ($i != $#{$l->{'tables'}}) {
               push @c, ['', '', '\rule{' . $tablesep*$multiplier . 'pt}{0pt}', '', ''];
            }
         }

         print '\makebox[' . ($linelength) . 'pt][r]{\hspace{1pt}\begin{tabular}{' . ('@{{\color{gray}\vrule width ' . $rulewidth . 'pt}}c')x($#c+1) . '@{{\color{gray}\vrule width ' . $rulewidth . 'pt}}' . '}'
         .     join('&', map {$_->[0]} @c) . '\\\\'
         .     join('&', map {$_->[1]} @c) . '\\\\'
         .     join('&', map {$_->[2]} @c) . '\\\\'
         .     join('&', map {$_->[3]} @c) . '\\\\'
         .     join('&', map {$_->[4]} @c) . '\\\\'
         .     join('&', map {$_->[5]} @c) . '\\\\'
         .     join('&', map {$_->[6]} @c) . '\\\\'
         .     join('&', map {$_->[7]} @c) . '\\\\'
         .     join('&', map {$_->[8]} @c) . '\\\\'
         .     join('&', map {$_->[9]} @c) . '\\\\'
         .     join('&', map {$_->[10]} @c) . '\\\\'
         . '\end{tabular}}' . "\n";

         print '\vspace{1pt}', "\n\n";
      }

      # for (my $i = 0; $i <= $#f; $i++) {
      #    print '\footnotetext[' . ($i+1) . ']{', $f[$i], '}', "\n\n";
      # }

      $plv = $page->{'lastverse'};
   }
}

